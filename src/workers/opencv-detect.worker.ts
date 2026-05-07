/// <reference lib="webworker" />
export {}

// Emscripten runtime expects these globals — stub them out in the worker context
;(self as any).window = self
;(self as any).document = {
  createElement: () => ({ getContext: () => null, style: {} }),
  getElementById: () => null,
}

interface DetectedBox { id: number; x: number; y: number; w: number; h: number }

let cv: any = null

async function getCV() {
  if (cv) return cv
  const mod = await import('@techstark/opencv-js')
  cv = mod.default
  if (!cv.Mat) {
    await new Promise<void>(resolve => { cv.onRuntimeInitialized = resolve })
  }
  return cv
}

self.addEventListener('message', async (e: MessageEvent<{ buffer: ArrayBuffer; width: number; height: number }>) => {
  const { buffer, width, height } = e.data
  try {
    const cv = await getCV()
    const imgData = new ImageData(new Uint8ClampedArray(buffer), width, height)
    const src = cv.matFromImageData(imgData)
    const gray = new cv.Mat()
    const blurred = new cv.Mat()
    const thresh = new cv.Mat()
    const morph = new cv.Mat()
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    try {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
      cv.GaussianBlur(gray, blurred, new cv.Size(3, 3), 0)
      cv.adaptiveThreshold(blurred, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2)
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5))
      cv.morphologyEx(thresh, morph, cv.MORPH_CLOSE, kernel)
      kernel.delete()
      cv.findContours(morph, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

      const boxes: DetectedBox[] = []
      const canvasArea = width * height
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i)
        const rect = cv.boundingRect(contour)
        const area = rect.width * rect.height
        if (area < canvasArea * 0.001 || area > canvasArea * 0.2) { contour.delete(); continue }
        const ar = rect.width / rect.height
        if (ar < 0.1 || ar > 20) { contour.delete(); continue }
        const approx = new cv.Mat()
        cv.approxPolyDP(contour, approx, 0.02 * cv.arcLength(contour, true), true)
        const isRect = approx.rows >= 4 && approx.rows <= 6
        approx.delete()
        contour.delete()
        if (isRect) boxes.push({ id: boxes.length + 1, x: rect.x, y: rect.y, w: rect.width, h: rect.height })
      }
      ;(self as DedicatedWorkerGlobalScope).postMessage({ boxes })
    } finally {
      src.delete(); gray.delete(); blurred.delete(); thresh.delete()
      morph.delete(); contours.delete(); hierarchy.delete()
    }
  } catch (err: any) {
    ;(self as DedicatedWorkerGlobalScope).postMessage({ error: err.message ?? 'Detection failed' })
  }
})

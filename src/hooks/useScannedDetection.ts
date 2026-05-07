import { useRef, useState, useCallback } from 'react'

export interface DetectedBox {
  id: number
  x: number
  y: number
  w: number
  h: number
}

export function useScannedDetection() {
  const [cvReady, setCvReady] = useState(false)
  const cvRef = useRef<any>(null)

  const loadOpenCV = useCallback(async () => {
    if (cvRef.current) return
    const module = await import('@techstark/opencv-js')
    const cv = module.default
    await new Promise<void>((resolve) => {
      if (cv.Mat) {
        resolve()
      } else {
        cv.onRuntimeInitialized = resolve
      }
    })
    cvRef.current = cv
    setCvReady(true)
  }, [])

  const detectRectangles = useCallback((canvas: HTMLCanvasElement): DetectedBox[] => {
    const cv = cvRef.current
    if (!cv) throw new Error('OpenCV not loaded')

    const src = cv.imread(canvas)
    const gray = new cv.Mat()
    const blurred = new cv.Mat()
    const thresh = new cv.Mat()
    const morph = new cv.Mat()
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()

    try {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
      cv.GaussianBlur(gray, blurred, new cv.Size(3, 3), 0)
      cv.adaptiveThreshold(
        blurred, thresh, 255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY_INV,
        11, 2
      )
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5))
      cv.morphologyEx(thresh, morph, cv.MORPH_CLOSE, kernel)
      kernel.delete()

      cv.findContours(morph, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

      const boxes: DetectedBox[] = []
      const canvasArea = canvas.width * canvas.height

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i)
        const rect = cv.boundingRect(contour)

        const area = rect.width * rect.height
        if (area < canvasArea * 0.001 || area > canvasArea * 0.2) {
          contour.delete()
          continue
        }
        const ar = rect.width / rect.height
        if (ar < 0.1 || ar > 20) {
          contour.delete()
          continue
        }

        const approx = new cv.Mat()
        cv.approxPolyDP(contour, approx, 0.02 * cv.arcLength(contour, true), true)
        const isRect = approx.rows >= 4 && approx.rows <= 6
        approx.delete()
        contour.delete()

        if (isRect) {
          boxes.push({ id: boxes.length + 1, x: rect.x, y: rect.y, w: rect.width, h: rect.height })
        }
      }

      return boxes
    } finally {
      src.delete()
      gray.delete()
      blurred.delete()
      thresh.delete()
      morph.delete()
      contours.delete()
      hierarchy.delete()
    }
  }, [])

  const drawBoxesOnCanvas = useCallback(
    (sourceCanvas: HTMLCanvasElement, boxes: DetectedBox[]): string => {
      const offscreen = document.createElement('canvas')
      offscreen.width = sourceCanvas.width
      offscreen.height = sourceCanvas.height
      const ctx = offscreen.getContext('2d')!
      ctx.drawImage(sourceCanvas, 0, 0)

      const fontSize = Math.max(12, Math.floor(sourceCanvas.width / 80))
      ctx.strokeStyle = '#FF0000'
      ctx.lineWidth = 2
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.fillStyle = '#FF0000'

      boxes.forEach(box => {
        ctx.strokeRect(box.x, box.y, box.w, box.h)
        ctx.fillText(String(box.id), box.x + 4, box.y + fontSize)
      })

      return offscreen.toDataURL('image/jpeg', 0.85).split(',')[1]
    },
    []
  )

  return { cvReady, loadOpenCV, detectRectangles, drawBoxesOnCanvas }
}

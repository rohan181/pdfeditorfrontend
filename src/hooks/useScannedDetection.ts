import { useRef, useCallback } from 'react'

export interface DetectedBox {
  id: number
  x: number
  y: number
  w: number
  h: number
}

const MAX_DETECT_WIDTH = 1000 // scale down large canvases before sending to worker

export function useScannedDetection() {
  const workerRef = useRef<Worker | null>(null)

  const getWorker = useCallback((): Worker => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/opencv-detect.worker.ts', import.meta.url)
      )
    }
    return workerRef.current
  }, [])

  // No-op kept for API compatibility — worker initialises OpenCV on first use
  const loadOpenCV = useCallback(async () => {
    getWorker()
  }, [getWorker])

  const detectRectangles = useCallback((canvas: HTMLCanvasElement): Promise<DetectedBox[]> => {
    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('No 2d context on canvas')); return }

      // Downscale to reduce pixel data sent to worker
      const scale = canvas.width > MAX_DETECT_WIDTH ? MAX_DETECT_WIDTH / canvas.width : 1
      const w = Math.round(canvas.width * scale)
      const h = Math.round(canvas.height * scale)

      let imageData: ImageData
      if (scale < 1) {
        const tmp = document.createElement('canvas')
        tmp.width = w
        tmp.height = h
        tmp.getContext('2d')!.drawImage(canvas, 0, 0, w, h)
        imageData = tmp.getContext('2d')!.getImageData(0, 0, w, h)
      } else {
        imageData = ctx.getImageData(0, 0, w, h)
      }

      const worker = getWorker()

      const onMsg = (e: MessageEvent<{ boxes?: DetectedBox[]; error?: string }>) => {
        worker.removeEventListener('message', onMsg)
        worker.removeEventListener('error', onErr)
        if (e.data.error) { reject(new Error(e.data.error)); return }
        const boxes = (e.data.boxes ?? []).map(b => ({
          ...b,
          x: Math.round(b.x / scale),
          y: Math.round(b.y / scale),
          w: Math.round(b.w / scale),
          h: Math.round(b.h / scale),
        }))
        resolve(boxes)
      }
      const onErr = (e: ErrorEvent) => {
        worker.removeEventListener('message', onMsg)
        worker.removeEventListener('error', onErr)
        reject(new Error(e.message))
      }

      worker.addEventListener('message', onMsg)
      worker.addEventListener('error', onErr)
      // Transfer the buffer to avoid copying
      worker.postMessage({ buffer: imageData.data.buffer, width: w, height: h }, [imageData.data.buffer])
    })
  }, [getWorker])

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

  return { loadOpenCV, detectRectangles, drawBoxesOnCanvas }
}

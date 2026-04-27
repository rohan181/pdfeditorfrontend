export type ToolMode =
  | 'select' | 'text' | 'image' | 'signature' | 'stamp'
  | 'highlight' | 'pan' | 'mark' | 'annotation' | 'shape'
  | 'crop' | 'draw' | 'watermark' | 'eraser'

export interface PDFSource {
  id: string
  doc: any
  bytes: ArrayBuffer
  name: string
}

export interface PageSlot {
  id: string
  type: 'pdf' | 'blank' | 'image'
  sourceId?: string
  pageNum?: number
  imageSrc?: string
  baseWidth: number
  baseHeight: number
  thumbUrl: string
  rotation?: 0 | 90 | 180 | 270
  crop?: { x: number; y: number; w: number; h: number }
}

export interface BaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  pageSlotId: string
  opacity?: number
}

export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontSize: number
  fontFamily: string
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
  align: 'left' | 'center' | 'right'
  bgColor: string
}

export interface ImageElement extends BaseElement {
  type: 'image'
  src: string
}

export interface SignatureElement extends BaseElement {
  type: 'signature'
  src: string
}

export interface StampElement extends BaseElement {
  type: 'stamp'
  label: string
  color: string
  opacity: number
}

export interface HighlightElement extends BaseElement {
  type: 'highlight'
  color: string
  opacity: number
}

export interface MarkElement extends BaseElement {
  type: 'mark'
  markType: 'tick' | 'cross' | 'circle' | 'square' | 'filledbox'
  color: string
  strokeWidth: number
}

export interface AnnotationElement extends BaseElement {
  type: 'annotation'
  text: string
  color: string
}

export interface ShapeElement extends BaseElement {
  type: 'shape'
  shapeType: 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'polygon'
  strokeColor: string
  fillColor: string
  strokeWidth: number
}

export interface DrawElement extends BaseElement {
  type: 'draw'
  points: Array<{ x: number; y: number }>
  color: string
  strokeWidth: number
  opacity: number
}

export interface WatermarkElement extends BaseElement {
  type: 'watermark'
  text: string
  color: string
  opacity: number
  fontSize: number
  rotation: number
  imageSrc?: string  // optional image watermark (overrides text)
}

export type PDFElement =
  | TextElement
  | ImageElement
  | SignatureElement
  | StampElement
  | HighlightElement
  | MarkElement
  | AnnotationElement
  | ShapeElement
  | DrawElement
  | WatermarkElement

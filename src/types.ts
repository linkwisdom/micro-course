export type ElementType = 'text' | 'image' | 'shape'
export type ShapeType = 'circle' | 'square' | 'triangle' | 'line' | 'arrow' | 'chatBubble'

export interface Element {
  id: string
  type: ElementType
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  shapeType?: ShapeType
  fontSize?: number
  color?: string
  fontFamily?: string
  lineHeight?: number
  isBold?: boolean
  isItalic?: boolean
  borderSize?: number
  borderColor?: string
  zIndex: number
}

export interface Slide {
  title: string | number | readonly string[] | undefined
  backgroundColor: string | number | readonly string[] | undefined
  backgroundImage: string | number | readonly string[] | undefined
  id: string
  elements: Element[]
}
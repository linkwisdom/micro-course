export type ElementType = 'text' | 'image' | 'shape'

export interface Element {
  id: string
  type: ElementType
  content: string
  position: { x: number; y: number }
  size: { width: number | string; height: number | string }
  fileName?: string
}

export interface Slide {
  id: string
  elements: Element[]
}
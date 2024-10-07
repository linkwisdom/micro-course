import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Slide, ShapeType } from '../types'
import Circle from './shapes/Circle'
import Square from './shapes/Square'
import Triangle from './shapes/Triangle'
import Line from './shapes/Line'

interface PresentationProps {
  slides: Slide[]
  onClose: () => void
}

const Presentation: React.FC<PresentationProps> = ({ slides, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const renderShape = (shapeType: ShapeType, size: number) => {
    switch (shapeType) {
      case 'circle':
        return <Circle size={size} color="white" />
      case 'square':
        return <Square size={size} color="white" />
      case 'triangle':
        return <Triangle size={size} color="white" />
      case 'line':
        return <Line size={size} color="white" />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <button
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <div className="w-full h-full flex items-center justify-center">
        {slides[currentSlide].elements.map((element) => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              transform: `rotate(${element.rotation || 0}deg)`,
            }}
          >
            {element.type === 'text' && <div className="text-white">{element.content}</div>}
            {element.type === 'image' && <img src={element.content} alt="" className="w-full h-full object-contain" />}
            {element.type === 'shape' && element.shapeType && (
              <div className="w-full h-full flex items-center justify-center">
                {renderShape(element.shapeType, Math.min(parseInt(element.size.width as string), parseInt(element.size.height as string)))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}

export default Presentation
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Slide } from '../types'

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
            }}
          >
            {element.type === 'text' && <div className="text-white">{element.content}</div>}
            {element.type === 'image' && <img src={element.content} alt="" />}
            {element.type === 'shape' && <div className="bg-gray-300">{element.content}</div>}
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
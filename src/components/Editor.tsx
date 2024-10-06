import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import { Slide, Element } from '../types'

interface EditorProps {
  slide: Slide
  updateSlide: (slide: Slide) => void
}

const Editor: React.FC<EditorProps> = ({ slide, updateSlide }) => {
  const [editingId, setEditingId] = useState<string | null>(null)

  const updateElement = (updatedElement: Element) => {
    const updatedElements = slide.elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    )
    updateSlide({ ...slide, elements: updatedElements })
  }

  const handleTextChange = (id: string, newContent: string) => {
    const updatedElement = slide.elements.find((el) => el.id === id)
    if (updatedElement) {
      updateElement({ ...updatedElement, content: newContent })
    }
  }

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg relative" style={{ width: '1024px', height: '576px' }}>
      {slide.elements.map((element) => (
        <Rnd
          key={element.id}
          size={{ width: element.size.width, height: element.size.height }}
          position={{ x: element.position.x, y: element.position.y }}
          onDragStop={(e, d) => {
            updateElement({ ...element, position: { x: d.x, y: d.y } })
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            updateElement({
              ...element,
              position,
              size: { width: ref.style.width, height: ref.style.height },
            })
          }}
        >
          {element.type === 'text' && (
            editingId === element.id ? (
              <textarea
                className="w-full h-full p-2 outline-none resize-none"
                value={element.content}
                onChange={(e) => handleTextChange(element.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                autoFocus
              />
            ) : (
              <div
                className="w-full h-full p-2 cursor-text"
                onClick={() => setEditingId(element.id)}
              >
                {element.content}
              </div>
            )
          )}
          {element.type === 'image' && <img src={element.content} alt="" className="w-full h-full object-contain" />}
          {element.type === 'shape' && <div className="w-full h-full bg-gray-300">{element.content}</div>}
        </Rnd>
      ))}
    </div>
  )
}

export default Editor
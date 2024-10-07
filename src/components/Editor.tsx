import React, { useState, useRef, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import { Slide, Element, ShapeType } from '../types'
import Circle from './shapes/Circle'
import Square from './shapes/Square'
import Triangle from './shapes/Triangle'
import Line from './shapes/Line'
import Arrow from './shapes/Arrow'
import ChatBubble from './shapes/ChatBubble' // 导入 ChatBubble 组件
import FontStyleSelector from './FontStyleSelector'
import ShapeStyleSelector from './ShapeStyleSelector'

interface EditorProps {
  slide: Slide
  updateSlide: (updatedSlide: Slide) => void
}

const Editor: React.FC<EditorProps> = ({ slide, updateSlide }) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const updateElement = (updatedElement: Element) => {
    const updatedElements = slide.elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    )
    updateSlide({ ...slide, elements: updatedElements })
  }

  const handleEditorClick = () => {
    // setSelectedElement(null)
  }

  const renderShape = (element: Element) => {
    const { shapeType, size, color, borderSize, borderColor, position, content } = element
    const shapeSize = Math.min(size.width, size.height)

    switch (shapeType) {
      case 'circle':
        return <Circle size={shapeSize} color={color} borderSize={borderSize} borderColor={borderColor} />
      case 'square':
        return <Square size={shapeSize} color={color} borderSize={borderSize} borderColor={borderColor} />
      case 'triangle':
        return <Triangle size={shapeSize} color={color} borderSize={borderSize} borderColor={borderColor} />
      case 'line':
        return <Line size={shapeSize} color={color} borderSize={borderSize} borderColor={borderColor} />
      case 'arrow':
        return <Arrow start={position} end={{ x: position.x + size.width, y: position.y + size.height }} color={color || '#000000'} />
      case 'chatBubble':
        return <ChatBubble size={shapeSize} color={color} text={content} mode='edit' textColor={borderColor || '#000000'} />
      default:
        return null
    }
  }

  const curElement = slide.elements.find(el => el.id === selectedElement);

  return (
    <div 
      className="w-full h-full bg-white shadow-lg rounded-lg relative" 
      style={{ width: '1024px', height: '576px' }}
      ref={editorRef}
      onClick={handleEditorClick}
    >
      {slide.elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map((element) => (
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
              rotation: delta,
              size: { 
                width: parseInt(ref.style.width), 
                height: parseInt(ref.style.height) 
              },
            })
          }}
          style={{ 
            transform: `rotate(${element.rotation}deg)`,
            border: selectedElement === element.id ? '2px solid blue' : 'none',
            zIndex: element.zIndex || 0,
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            setSelectedElement(element.id)
          }}
          enableResizing={{
            top: true, right: true, bottom: true, left: true,
            topRight: true, topLeft: true, bottomRight: true, bottomLeft: true
          }}
          dragHandleClassName="drag-handle"
        >
          <div className="w-full h-full drag-handle">
            {element.type === 'text' && (
              <div
                style={{
                  fontSize: `${element.fontSize}px`,
                  fontFamily: element.fontFamily,
                  color: element.color,
                  lineHeight: `${element.lineHeight}`,
                  fontWeight: element.isBold ? 'bold' : 'normal',
                  fontStyle: element.isItalic ? 'italic' : 'normal',
                }}
              >
                {element.content}
              </div>
            )}
            {element.type === 'image' && <img src={element.content} alt="" className="w-full h-full object-contain" />}
            {element.type === 'shape' && element.shapeType && (
              <div className="w-full h-full flex items-center justify-center">
                {renderShape(element)}
              </div>
            )}
          </div>
        </Rnd>
      ))}
      {selectedElement && (
        <div className="absolute top-0 left-0 right-0">
          {curElement?.type === 'text' ? (
            <FontStyleSelector
              fontSize={curElement?.fontSize || 16}
              fontColor={curElement?.color || '#000000'}
              fontFamily={curElement?.fontFamily || 'Arial'}
              lineHeight={curElement?.lineHeight || 1.2}
              isBold={curElement?.isBold || false}
              isItalic={curElement?.isItalic || false}
              zIndex={curElement?.zIndex || 0}
              content={curElement?.content || ''}
              onFontSizeChange={(size) => updateElement({ ...curElement!, fontSize: size })}
              onFontColorChange={(color) => updateElement({ ...curElement!, color: color })}
              onFontFamilyChange={(family) => updateElement({ ...curElement!, fontFamily: family })}
              onLineHeightChange={(height) => updateElement({ ...curElement!, lineHeight: height })}
              onBoldToggle={() => updateElement({ ...curElement!, isBold: !curElement?.isBold })}
              onItalicToggle={() => updateElement({ ...curElement!, isItalic: !curElement?.isItalic })}
              onZIndexChange={(zIndex) => updateElement({ ...curElement!, zIndex: zIndex })}
              onContentChange={(content) => updateElement({ ...curElement!, content: content })}
            />
          ) : (
            <ShapeStyleSelector
              width={curElement?.size.width || 100}
              height={curElement?.size.height || 100}
              x={curElement?.position.x || 0}
              y={curElement?.position.y || 0}
              rotation={curElement?.rotation || 0}
              fillColor={curElement?.color || '#000000'}
              borderSize={curElement?.borderSize || 0}
              borderColor={curElement?.borderColor || '#000000'}
              zIndex={curElement?.zIndex || 0}
              onWidthChange={(width) => updateElement({ ...curElement!, size: { ...curElement!.size, width } })}
              onHeightChange={(height) => updateElement({ ...curElement!, size: { ...curElement!.size, height } })}
              onPositionChange={(x, y) => updateElement({ ...curElement!, position: { x, y } })}
              onRotationChange={(rotation) => updateElement({ ...curElement!, rotation })}
              onFillColorChange={(color) => updateElement({ ...curElement!, color })}
              onBorderSizeChange={(size) => updateElement({ ...curElement!, borderSize: size })}
              onBorderColorChange={(color) => updateElement({ ...curElement!, borderColor: color })}
              onZIndexChange={(zIndex) => updateElement({ ...curElement!, zIndex })}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Editor
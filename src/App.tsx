import React, { useState, useRef } from 'react'
import { Layers, Play, Download, Image, Type } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Editor from './components/Editor'
import Presentation from './components/Presentation'
import ShapeSelector from './components/ShapeSelector'
import SlideSetting from './components/SlideSetting' // 导入新的 SlideSetting 组件
import { Slide, ElementType, ShapeType } from './types'

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', elements: [], title: 'Slide 1', backgroundColor: '#ffffff', backgroundImage: '' },
  ])
  const [showSlideSetting, SetShowSlideSetting] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPresenting, setIsPresenting] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const addSlide = () => {
    setSlides([...slides, { id: Date.now().toString(), elements: [], title: `Slide ${slides.length + 1}`, backgroundColor: '#ffffff', backgroundImage: '' }])
    setCurrentSlide(slides.length)
  }

  const updateSlide = (updatedSlide: Slide) => {
    const updatedSlides = slides.map((slide) =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    )
    setSlides(updatedSlides)
  }

  const addElement = (type: ElementType, content: string = '') => {
    const newElement = {
      id: Date.now().toString(),
      type,
      content,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 },
      rotation: 0,
      fontSize: 16,
      color: '#000000',
      zIndex: 1,
    }
    const updatedSlide = {
      ...slides[currentSlide],
      elements: [...slides[currentSlide].elements, newElement],
    }
    updateSlide(updatedSlide)
    SetShowSlideSetting(false)
  }

  const addShape = (shapeType: ShapeType) => {
    const newElement = {
      id: Date.now().toString(),
      type: 'shape' as ElementType,
      content: '',
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      shapeType,
      color: '#000000',
      zIndex: 1,
    }
    const updatedSlide = {
      ...slides[currentSlide],
      elements: [...slides[currentSlide].elements, newElement],
    }
    updateSlide(updatedSlide)
  }

  const exportToPDF = async () => {
    if (editorRef.current) {
      const canvas = await html2canvas(editorRef.current)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save('presentation.pdf')
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Micro-course Creator</h1>
      </header>
      <SlideSetting
        slide={slides[currentSlide]}
        show={showSlideSetting}
        updateSlide={updateSlide}
        onClose={()=>{SetShowSlideSetting(false)}}
      />
      <main className="flex-1 flex">
        <aside className="w-64 bg-gray-100 p-4">
          <div className="space-y-4">
            <button
              className="w-full bg-blue-500 text-white p-2 rounded"
              onClick={addSlide}
            >
              <Layers className="inline-block mr-2" />
              Add Slide
            </button>
            <button
              className="w-full bg-green-500 text-white p-2 rounded"
              onClick={() => addElement('text', 'New Text')}
            >
              <Type className="inline-block mr-2" />
              Add Text
            </button>
            <button
              className="w-full bg-yellow-500 text-white p-2 rounded"
              onClick={() => addElement('image', 'https://picsum.photos/200/300')}
            >
              <Image className="inline-block mr-2" />
              Add Image
            </button>
            <ShapeSelector onSelectShape={addShape} />
            <button
              className="w-full bg-purple-500 text-white p-2 rounded"
              onClick={() => setIsPresenting(true)}
            >
              <Play className="inline-block mr-2" />
              Present
            </button>
            <button
              className="w-full bg-red-500 text-white p-2 rounded"
              onClick={exportToPDF}
            >
              <Download className="inline-block mr-2" />
              Export to PDF
            </button>
          </div>
        </aside>
        <section className="flex-1 p-4" ref={editorRef} style={{ backgroundColor: slides[currentSlide].backgroundColor, backgroundImage: `url(${slides[currentSlide].backgroundImage})` }}>
          <Editor
            slide={slides[currentSlide]}
            updateSlide={updateSlide}
          />
        </section>
      </main>
      {isPresenting && (
        <Presentation
          slides={slides}
          onClose={() => setIsPresenting(false)}
        />
      )}
      <footer className="bg-gray-200 p-4 fixed bottom-0 w-full flex overflow-x-auto">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`p-2 m-1 border ${index === currentSlide ? 'border-blue-500' : 'border-gray-300'}`}
            onClick={() => { setCurrentSlide(index); SetShowSlideSetting(true);}}
          >
            {slide.title}
          </div>
        ))}
      </footer>
    </div>
  )
}

export default App
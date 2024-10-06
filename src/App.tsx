import React, { useState, useRef } from 'react'
import { Layers, Play, Download, Image, Type, Square } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Editor from './components/Editor'
import Presentation from './components/Presentation'
import { Slide, ElementType } from './types'

function App() {
  const [slides, setSlides] = useState<Slide[]>([{ id: '1', elements: [] }])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPresenting, setIsPresenting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])

  const addSlide = () => {
    setSlides([...slides, { id: Date.now().toString(), elements: [] }])
  }

  const updateSlide = (updatedSlide: Slide) => {
    const newSlides = [...slides]
    newSlides[currentSlide] = updatedSlide
    setSlides(newSlides)
  }

  const exportPresentation = async () => {
    const pdf = new jsPDF('l', 'mm', 'a4')
    const width = pdf.internal.pageSize.getWidth()
    const height = pdf.internal.pageSize.getHeight()

    for (let i = 0; i < slides.length; i++) {
      const slide = slidesRef.current[i]
      if (slide) {
        const canvas = await html2canvas(slide, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, 0, width, height)
      }
    }

    pdf.save('presentation.pdf')
  }

  const addElement = (type: ElementType) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? '新文本' : '',
      position: { x: 50, y: 50 },
      size: { width: 200, height: type === 'text' ? 50 : 200 },
    }
    updateSlide({ ...slides[currentSlide], elements: [...slides[currentSlide].elements, newElement] })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (file.size < 102400) { // 100KB
          addImageElement(content)
        } else {
          addImageElement(content, file.name)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const addImageElement = (content: string, fileName?: string) => {
    const newElement = {
      id: Date.now().toString(),
      type: 'image' as ElementType,
      content,
      fileName,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 200 },
    }
    updateSlide({ ...slides[currentSlide], elements: [...slides[currentSlide].elements, newElement] })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold">微课制作应用</h1>
      </header>
      <main className="flex-grow flex">
        {!isPresenting ? (
          <>
            <aside className="w-64 bg-white shadow-md p-4">
              <button
                className="mb-4 w-full bg-blue-500 text-white py-2 px-4 rounded"
                onClick={addSlide}
              >
                添加幻灯片
              </button>
              <div className="space-y-2">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-2 border rounded cursor-pointer ${
                      index === currentSlide ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    幻灯片 {index + 1}
                  </div>
                ))}
              </div>
            </aside>
            <section className="flex-grow p-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  ref={(el) => (slidesRef.current[index] = el)}
                  className={`w-full h-full ${index === currentSlide ? '' : 'hidden'}`}
                >
                  <Editor slide={slide} updateSlide={updateSlide} />
                </div>
              ))}
            </section>
            <aside className="w-64 bg-white shadow-md p-4">
              <button
                className="mb-4 w-full bg-green-500 text-white py-2 px-4 rounded flex items-center justify-center"
                onClick={() => setIsPresenting(true)}
              >
                <Play className="mr-2" size={20} /> 开始演示
              </button>
              <button
                className="w-full bg-purple-500 text-white py-2 px-4 rounded flex items-center justify-center"
                onClick={exportPresentation}
              >
                <Download className="mr-2" size={20} /> 导出PDF
              </button>
              <div className="mt-4 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button
                  className="w-full bg-gray-200 py-2 px-4 rounded flex items-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="mr-2" size={20} /> 插入图片
                </button>
                <button
                  className="w-full bg-gray-200 py-2 px-4 rounded flex items-center"
                  onClick={() => addElement('text')}
                >
                  <Type className="mr-2" size={20} /> 添加文本
                </button>
                <button className="w-full bg-gray-200 py-2 px-4 rounded flex items-center">
                  <Square className="mr-2" size={20} /> 插入图形
                </button>
              </div>
            </aside>
          </>
        ) : (
          <Presentation
            slides={slides}
            onClose={() => setIsPresenting(false)}
          />
        )}
      </main>
    </div>
  )
}

export default App
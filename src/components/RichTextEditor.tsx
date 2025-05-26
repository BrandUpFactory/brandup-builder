'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Text eingeben...",
  className = ""
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        horizontalRule: false,
        code: false,
        codeBlock: false,
      }),
      Bold,
      Italic,
      Underline,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[100px] p-3 text-sm leading-relaxed',
      },
    },
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className={`border border-gray-200 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive('bold') ? 'bg-blue-100 border-blue-400' : 'bg-white'
          }`}
          title="Fett"
        >
          <strong className="text-sm">B</strong>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive('italic') ? 'bg-blue-100 border-blue-400' : 'bg-white'
          }`}
          title="Kursiv"
        >
          <em className="text-sm">I</em>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive('underline') ? 'bg-blue-100 border-blue-400' : 'bg-white'
          }`}
          title="Unterstrichen"
        >
          <u className="text-sm">U</u>
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }}
          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          title="Alle Formatierungen entfernen"
        >
          Formatierung löschen
        </button>
      </div>
      
      {/* Editor */}
      <div className="min-h-[100px] max-h-[200px] overflow-y-auto relative">
        <EditorContent 
          editor={editor} 
          className="w-full focus:border-[#1c2838] focus:ring focus:ring-[#1c2838]/20 focus:outline-none transition"
        />
        {!editor.getText() && (
          <div className="absolute top-0 left-0 p-3 pointer-events-none text-gray-400 text-sm">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}
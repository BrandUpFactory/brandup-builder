'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
  placeholder?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  className = '',
  placeholder = ''
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            style: 'margin: 0; display: inline;'
          }
        },
        bold: false,
        italic: false
      }),
      Bold.configure({
        HTMLAttributes: {
          style: 'font-weight: 600;'
        }
      }),
      Italic.configure({
        HTMLAttributes: {
          style: 'font-style: italic;'
        }
      }),
      Underline.configure({
        HTMLAttributes: {
          style: 'text-decoration: underline;'
        }
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
        'data-placeholder': placeholder,
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
    <div className={`border border-gray-200 rounded-md rich-text-editor ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded transition-colors ${
            editor.isActive('bold') 
              ? 'bg-blue-100 border-blue-400 text-blue-700' 
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Fett"
        >
          <strong className="text-sm">B</strong>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded transition-colors ${
            editor.isActive('italic') 
              ? 'bg-blue-100 border-blue-400 text-blue-700' 
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Kursiv"
        >
          <em className="text-sm">I</em>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded transition-colors ${
            editor.isActive('underline') 
              ? 'bg-blue-100 border-blue-400 text-blue-700' 
              : 'bg-white hover:bg-gray-100'
          }`}
          title="Unterstreichen"
        >
          <span className="text-sm underline">U</span>
        </button>
      </div>
      
      {/* Editor */}
      <div className="p-3">
        <EditorContent 
          editor={editor} 
          className="min-h-[40px] cursor-text"
        />
      </div>
    </div>
  )
}

export default RichTextEditor
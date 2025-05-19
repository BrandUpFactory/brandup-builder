'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface ImageManagerProps {
  onSelect: (url: string) => void
  currentImage?: string
}

interface StoredImage {
  id: string
  name: string
  url: string
  created_at: string
  user_id: string
}

export default function ImageManager({ onSelect, currentImage }: ImageManagerProps) {
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<StoredImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | undefined>(currentImage)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Fetch user images on open
  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen])

  // Fetch user's images from storage
  const fetchImages = async () => {
    setLoading(true)
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData.user) {
      console.error('Error fetching user:', userError)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching images:', error)
    } else {
      setImages(data || [])
    }

    setLoading(false)
  }

  // Handle image upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Bitte wähle ein Bild aus (JPEG, PNG, GIF, etc.)')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Die Bilddatei darf maximal 5MB groß sein')
      return
    }
    
    setUploading(true)
    setUploadError(null)
    
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('User not authenticated')
      
      // Generate unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${userData.user.id}/${fileName}`
      
      // Upload to Storage
      const { error: uploadError, data: uploadData } = await supabase
        .storage
        .from('images')
        .upload(filePath, file)
        
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath)
        
      if (!urlData.publicUrl) throw new Error('Failed to get public URL')
      
      // Store image metadata in database
      const { error: dbError } = await supabase
        .from('images')
        .insert({
          name: file.name,
          url: urlData.publicUrl,
          user_id: userData.user.id
        })
        
      if (dbError) throw dbError
      
      // Refresh images
      await fetchImages()
      
      // Auto-select the uploaded image
      setSelectedImage(urlData.publicUrl)
      
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadError('Fehler beim Hochladen des Bildes')
    } finally {
      setUploading(false)
      
      // Reset file input
      event.target.value = ''
    }
  }

  // Handle deleting an image
  const handleDeleteImage = async (image: StoredImage) => {
    if (!confirm(`Möchtest du das Bild "${image.name}" wirklich löschen?`)) return
    
    try {
      // Extract the path from the URL
      const urlParts = image.url.split('/')
      const bucket = urlParts[urlParts.length - 2]
      const path = urlParts[urlParts.length - 1]
      const filePath = `${bucket}/${path}`
      
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('images')
        .remove([filePath])
        
      if (storageError) throw storageError
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', image.id)
        
      if (dbError) throw dbError
      
      // Refresh images
      await fetchImages()
      
      // Unselect the image if it was selected
      if (selectedImage === image.url) {
        setSelectedImage(undefined)
      }
      
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Fehler beim Löschen des Bildes')
    }
  }

  // Handle selecting an image
  const handleImageSelect = (image: StoredImage) => {
    setSelectedImage(image.url)
  }

  // Handle confirming selection
  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelect(selectedImage)
    }
    setIsOpen(false)
  }

  // Handle close without selection
  const handleCancel = () => {
    setSelectedImage(currentImage)
    setIsOpen(false)
  }

  // Render image picker UI
  if (!isOpen) {
    return (
      <div className="flex mt-1">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex-1 flex items-center px-3 py-1.5 border border-gray-300 bg-white rounded-l-md text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Bilder durchsuchen
        </button>
        <input
          type="text"
          value={currentImage || ''}
          onChange={(e) => onSelect(e.target.value)}
          placeholder="Bild-URL eingeben"
          className="flex-1 px-3 py-1.5 border-t border-b border-r border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Bilder-Manager</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-10 w-10 border-3 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                  <p className="text-sm text-gray-500">Bild wird hochgeladen...</p>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klicke zum Hochladen</span> oder ziehe Dateien hierher</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF bis zu 5MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Deine Bilder</h4>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">Noch keine Bilder hochgeladen</p>
              <p className="text-sm text-gray-400 mt-1">Lade Bilder hoch, um sie in deinen Sektionen zu verwenden</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative border rounded-lg overflow-hidden group cursor-pointer
                    ${selectedImage === image.url ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:shadow-md'}`}
                  onClick={() => handleImageSelect(image)}
                >
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteImage(image)
                      }}
                      className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-700 truncate" title={image.name}>
                      {image.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleConfirmSelection}
            disabled={!selectedImage}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedImage
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            } transition`}
          >
            Bild auswählen
          </button>
        </div>
      </div>
    </div>
  )
}
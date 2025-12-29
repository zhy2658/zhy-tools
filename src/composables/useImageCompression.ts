import { ref } from 'vue'
import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker: boolean
  fileType?: string
  initialQuality?: number
}

export interface CompressionResult {
  originalFile: File
  compressedFile: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
  previewUrl: string
  originalPreviewUrl: string
}

export function useImageCompression() {
  const isCompressing = ref(false)
  const error = ref<string | null>(null)
  const result = ref<CompressionResult | null>(null)

  const compressImage = async (file: File, options: CompressionOptions) => {
    isCompressing.value = true
    error.value = null
    result.value = null

    try {
      // Create original preview
      const originalPreviewUrl = URL.createObjectURL(file)

      // Compress
      // Note: browser-image-compression options
      // maxSizeMB: number
      // maxWidthOrHeight: number
      // useWebWorker: boolean
      // fileType?: string
      // initialQuality?: number

      const compressedFile = await imageCompression(file, options)

      const compressedPreviewUrl = URL.createObjectURL(compressedFile)

      result.value = {
        originalFile: file,
        compressedFile: compressedFile,
        originalSize: file.size,
        compressedSize: compressedFile.size,
        compressionRatio: (1 - compressedFile.size / file.size) * 100,
        previewUrl: compressedPreviewUrl,
        originalPreviewUrl: originalPreviewUrl
      }
    } catch (err: any) {
      console.error('Compression error:', err)
      error.value = err.message || 'Failed to compress image'
    } finally {
      isCompressing.value = false
    }
  }

  const downloadImage = () => {
    if (!result.value) return

    const link = document.createElement('a')
    link.href = result.value.previewUrl
    link.download = `compressed-${result.value.originalFile.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    isCompressing,
    error,
    result,
    compressImage,
    downloadImage
  }
}

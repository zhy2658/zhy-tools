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
  relativePath?: string
}

export function useImageCompression() {
  const isCompressing = ref(false)
  const error = ref<string | null>(null)
  const result = ref<CompressionResult | null>(null)
  const resultList = ref<CompressionResult[]>([])

  const compressImage = async (file: File, options: CompressionOptions) => {
    isCompressing.value = true
    error.value = null
    result.value = null
    resultList.value = []

    try {
      const originalPreviewUrl = URL.createObjectURL(file)
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

  const compressImages = async (files: File[], options: CompressionOptions) => {
    isCompressing.value = true
    error.value = null
    result.value = null
    resultList.value = []
    try {
      for (const file of files) {
        const originalPreviewUrl = URL.createObjectURL(file)
        const compressedFile = await imageCompression(file, options)
        const compressedPreviewUrl = URL.createObjectURL(compressedFile)
        resultList.value.push({
          originalFile: file,
          compressedFile,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio: (1 - compressedFile.size / file.size) * 100,
          previewUrl: compressedPreviewUrl,
          originalPreviewUrl: originalPreviewUrl,
        })
      }
      if (resultList.value.length === 1) {
        result.value = resultList.value[0]
      }
    } catch (err: any) {
      console.error('Compression error:', err)
      error.value = err.message || 'Failed to compress images'
    } finally {
      isCompressing.value = false
    }
  }

  const compressImagesWithPaths = async (items: { file: File; relativePath: string }[], options: CompressionOptions) => {
    isCompressing.value = true
    error.value = null
    result.value = null
    resultList.value = []
    try {
      for (const { file, relativePath } of items) {
        const originalPreviewUrl = URL.createObjectURL(file)
        const compressedFile = await imageCompression(file, options)
        const compressedPreviewUrl = URL.createObjectURL(compressedFile)
        resultList.value.push({
          originalFile: file,
          compressedFile,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          compressionRatio: (1 - compressedFile.size / file.size) * 100,
          previewUrl: compressedPreviewUrl,
          originalPreviewUrl: originalPreviewUrl,
          relativePath,
        })
      }
      if (resultList.value.length === 1) {
        result.value = resultList.value[0]
      }
    } catch (err: any) {
      console.error('Compression error:', err)
      error.value = err.message || 'Failed to compress images'
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

  const downloadAll = () => {
    if (!resultList.value.length) return
    for (const item of resultList.value) {
      const link = document.createElement('a')
      link.href = item.previewUrl
      link.download = `compressed-${item.originalFile.name}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const downloadZip = async () => {
    if (!resultList.value.length) return
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    for (const item of resultList.value) {
      const path = item.relativePath || item.originalFile.name
      zip.file(path, item.compressedFile)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'compressed-images.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return {
    isCompressing,
    error,
    result,
    resultList,
    compressImage,
    compressImages,
    compressImagesWithPaths,
    downloadImage,
    downloadAll,
    downloadZip,
  }
}

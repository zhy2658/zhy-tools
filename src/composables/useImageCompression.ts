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
  previewUrl?: string
  originalPreviewUrl?: string
  relativePath?: string
}

export function useImageCompression() {
  const isCompressing = ref(false)
  const error = ref<string | null>(null)
  const result = ref<CompressionResult | null>(null)
  const resultList = ref<CompressionResult[]>([])

  const processFile = async (file: File, options: CompressionOptions, generatePreview: boolean, relativePath?: string): Promise<CompressionResult> => {
    let originalPreviewUrl
    let compressedPreviewUrl

    if (generatePreview) {
      originalPreviewUrl = URL.createObjectURL(file)
    }

    // Ensure fileType is passed if specified
    const compressionOptions = { ...options }
    if (options.fileType) {
       // browser-image-compression uses fileType to determine output format
       // It expects 'image/jpeg', 'image/png', etc.
    }

    const compressedFile = await imageCompression(file, compressionOptions)
    
    if (generatePreview) {
      compressedPreviewUrl = URL.createObjectURL(compressedFile)
    }

    return {
      originalFile: file,
      compressedFile: compressedFile,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      compressionRatio: (1 - compressedFile.size / file.size) * 100,
      previewUrl: compressedPreviewUrl,
      originalPreviewUrl: originalPreviewUrl,
      relativePath
    }
  }

  const compressImage = async (file: File, options: CompressionOptions) => {
    isCompressing.value = true
    error.value = null
    result.value = null
    resultList.value = []

    try {
      result.value = await processFile(file, options, true)
    } catch (err: any) {
      console.error('Compression error:', err)
      error.value = err.message || 'Failed to compress image'
    } finally {
      isCompressing.value = false
    }
  }

  const compressImages = async (files: File[], options: CompressionOptions, generatePreview: boolean = true) => {
    isCompressing.value = true
    error.value = null
    result.value = null
    resultList.value = []
    
    try {
      const concurrencyLimit = 5
      const chunks = []
      for (let i = 0; i < files.length; i += concurrencyLimit) {
        chunks.push(files.slice(i, i + concurrencyLimit))
      }

      for (const chunk of chunks) {
        const chunkResults = await Promise.all(
          chunk.map(file => processFile(file, options, generatePreview))
        )
        resultList.value.push(...chunkResults)
      }

      if (resultList.value.length === 1 && generatePreview) {
        result.value = resultList.value[0]
      }
    } catch (err: any) {
      console.error('Compression error:', err)
      error.value = err.message || 'Failed to compress images'
    } finally {
      isCompressing.value = false
    }
  }

  const compressImagesWithPaths = async (items: { file: File; relativePath: string }[], options: CompressionOptions, generatePreview: boolean = true) => {
    isCompressing.value = true
    error.value = null
    result.value = null
    resultList.value = []
    
    try {
      const concurrencyLimit = 5
      const chunks = []
      for (let i = 0; i < items.length; i += concurrencyLimit) {
        chunks.push(items.slice(i, i + concurrencyLimit))
      }

      for (const chunk of chunks) {
        const chunkResults = await Promise.all(
          chunk.map(({ file, relativePath }) => processFile(file, options, generatePreview, relativePath))
        )
        resultList.value.push(...chunkResults)
      }

      if (resultList.value.length === 1 && generatePreview) {
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
    if (!result.value || !result.value.previewUrl) return
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
      let url = item.previewUrl
      let shouldRevoke = false
      if (!url) {
        url = URL.createObjectURL(item.compressedFile)
        shouldRevoke = true
      }

      const link = document.createElement('a')
      link.href = url
      link.download = `compressed-${item.originalFile.name}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      if (shouldRevoke) {
        URL.revokeObjectURL(url)
      }
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

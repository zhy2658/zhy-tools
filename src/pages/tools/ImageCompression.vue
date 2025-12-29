<script setup lang="ts">
import { reactive } from 'vue'
import FileUpload from '@/components/image-compressor/FileUpload.vue'
import CompressionSettings from '@/components/image-compressor/CompressionSettings.vue'
import ImagePreview from '@/components/image-compressor/ImagePreview.vue'
import DownloadButton from '@/components/image-compressor/DownloadButton.vue'
import { useImageCompression, type CompressionOptions } from '@/composables/useImageCompression'

const { isCompressing, result, compressImage, downloadImage } = useImageCompression()

const state = reactive({
  currentFile: null as File | null,
  options: {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8
  } as CompressionOptions
})

const handleFileSelected = (file: File) => {
  state.currentFile = file
  triggerCompression()
}

const handleOptionsChanged = (newOptions: any) => {
  state.options = { ...state.options, ...newOptions }
  if (state.currentFile) {
    triggerCompression()
  }
}

const triggerCompression = () => {
  if (state.currentFile) {
    compressImage(state.currentFile, state.options)
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Image Compression</h1>
      <p class="text-gray-600 dark:text-gray-400">Reduce image file size while maintaining quality.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Upload & Settings -->
      <div class="lg:col-span-1 space-y-6">
        <FileUpload @file-selected="handleFileSelected" />
        
        <CompressionSettings 
          :loading="isCompressing"
          @options-changed="handleOptionsChanged"
        />
      </div>

      <!-- Right Column: Preview & Action -->
      <div class="lg:col-span-2">
        <div v-if="!state.currentFile" class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
           <p class="text-gray-400">Upload an image to see preview</p>
        </div>

        <div v-else>
          <div v-loading="isCompressing" element-loading-text="Compressing..." element-loading-background="rgba(0, 0, 0, 0.7)" class="min-h-[200px] rounded-xl relative">
             <ImagePreview 
               v-if="result"
               :original-url="result.originalPreviewUrl"
               :compressed-url="result.previewUrl"
               :original-size="result.originalSize"
               :compressed-size="result.compressedSize"
             />
          </div>

          <DownloadButton 
            v-if="result && !isCompressing" 
            @download="downloadImage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

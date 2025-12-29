<script setup lang="ts">
import { reactive } from 'vue'
import FileUpload from '@/components/image-compressor/FileUpload.vue'
import CompressionSettings from '@/components/image-compressor/CompressionSettings.vue'
import ImagePreview from '@/components/image-compressor/ImagePreview.vue'
import DownloadButton from '@/components/image-compressor/DownloadButton.vue'
import { useImageCompression, type CompressionOptions } from '@/composables/useImageCompression'

const { isCompressing, result, resultList, compressImage, compressImages, compressImagesWithPaths, downloadImage, downloadAll, downloadZip } = useImageCompression()

const state = reactive({
  currentFile: null as File | null,
  currentFiles: [] as File[],
  currentFolderItems: [] as { file: File; relativePath: string }[],
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

const handleFilesSelected = (files: File[]) => {
  state.currentFiles = files
  triggerBatchCompression()
}

const handleFolderSelected = (items: { file: File; relativePath: string }[]) => {
  state.currentFolderItems = items
  triggerFolderCompression()
}

const handleOptionsChanged = (newOptions: any) => {
  state.options = { ...state.options, ...newOptions }
  if (state.currentFile) {
    triggerCompression()
  }
  if (state.currentFiles.length) {
    triggerBatchCompression()
  }
  if (state.currentFolderItems.length) {
    triggerFolderCompression()
  }
}

const triggerCompression = () => {
  if (state.currentFile) {
    compressImage(state.currentFile, state.options)
  }
}

const triggerBatchCompression = () => {
  if (state.currentFiles.length) {
    compressImages(state.currentFiles, state.options)
  }
}

const triggerFolderCompression = () => {
  if (state.currentFolderItems.length) {
    compressImagesWithPaths(state.currentFolderItems, state.options)
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">图片压缩</h1>
      <p class="text-gray-600 dark:text-gray-400">在尽量保证清晰度的前提下压缩图片体积。</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Upload & Settings -->
      <div class="lg:col-span-1 space-y-6">
        <FileUpload 
          @file-selected="handleFileSelected" 
          @files-selected="handleFilesSelected" 
          @folder-selected="handleFolderSelected" 
        />
        
        <CompressionSettings 
          :loading="isCompressing"
          @options-changed="handleOptionsChanged"
        />
      </div>

      <!-- Right Column: Preview & Action -->
      <div class="lg:col-span-2">
        <div v-if="!state.currentFile && !state.currentFiles.length && !state.currentFolderItems.length" class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
           <p class="text-gray-400">上传图片以查看预览</p>
        </div>

        <div v-else>
          <div v-loading="isCompressing" element-loading-text="压缩中..." element-loading-background="rgba(0, 0, 0, 0.7)" class="min-h-[200px] rounded-xl relative">
             <!-- 单文件预览 -->
             <ImagePreview 
               v-if="result && !resultList.length"
               :original-url="result.originalPreviewUrl"
               :compressed-url="result.previewUrl"
               :original-size="result.originalSize"
               :compressed-size="result.compressedSize"
             />
             <!-- 批量/文件夹预览 -->
             <div v-if="resultList.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <ImagePreview
                 v-for="(item, idx) in resultList"
                 :key="idx"
                 :original-url="item.originalPreviewUrl"
                 :compressed-url="item.previewUrl"
                 :original-size="item.originalSize"
                 :compressed-size="item.compressedSize"
               />
             </div>
          </div>

          <!-- 下载操作 -->
          <div class="mt-4 flex flex-wrap gap-3 justify-center">
            <DownloadButton 
              v-if="result && !isCompressing && !resultList.length" 
              @download="downloadImage"
            />
            <el-button 
              v-if="resultList.length && !isCompressing"
              type="primary"
              size="large"
              @click="downloadAll"
            >
              批量下载压缩后图片
            </el-button>
            <el-button 
              v-if="resultList.length && !isCompressing && state.currentFolderItems.length"
              type="success"
              size="large"
              @click="downloadZip"
            >
              打包下载 ZIP（保留目录结构）
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

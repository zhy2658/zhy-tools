<script setup lang="ts">
import { reactive, ref } from 'vue'
import FileUpload from '@/components/image-compressor/FileUpload.vue'
import CompressionSettings from '@/components/image-compressor/CompressionSettings.vue'
import ImagePreview from '@/components/image-compressor/ImagePreview.vue'
import DownloadButton from '@/components/image-compressor/DownloadButton.vue'
import { useImageCompression, type CompressionOptions } from '@/composables/useImageCompression'

const { isCompressing, result, resultList, compressImage, compressImages, compressImagesWithPaths, downloadImage, downloadAll, downloadZip } = useImageCompression()

const mode = ref<'single' | 'batch'>('single')

const state = reactive({
  currentFile: null as File | null,
  currentFiles: [] as File[],
  currentFolderItems: [] as { file: File; relativePath: string }[],
  options: {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: undefined
  } as CompressionOptions
})

const handleModeChange = (newMode: 'single' | 'batch') => {
  state.currentFile = null
  state.currentFiles = []
  state.currentFolderItems = []
  result.value = null
  resultList.value = []
}

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
    // Batch mode: skip preview generation
    compressImages(state.currentFiles, state.options, false)
  }
}

const triggerFolderCompression = () => {
  if (state.currentFolderItems.length) {
    // Folder/Batch mode: skip preview generation
    compressImagesWithPaths(state.currentFolderItems, state.options, false)
  }
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">图片压缩</h1>
      <p class="text-gray-600 dark:text-gray-400">在尽量保证清晰度的前提下压缩图片体积。</p>
    </div>

    <div class="mb-6 flex justify-center">
      <el-radio-group v-model="mode" @change="handleModeChange">
        <el-radio-button label="single">单张图片压缩</el-radio-button>
        <el-radio-button label="batch">批量图片压缩</el-radio-button>
      </el-radio-group>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Upload & Settings -->
      <div class="lg:col-span-1 space-y-6">
        <FileUpload 
          :mode="mode"
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
               v-if="mode === 'single' && result"
               :original-url="result.originalPreviewUrl!"
               :compressed-url="result.previewUrl!"
               :original-size="result.originalSize"
               :compressed-size="result.compressedSize"
             />
             
             <!-- 批量/文件夹列表视图 -->
             <div v-if="mode === 'batch' && resultList.length" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <el-table :data="resultList" style="width: 100%" height="400">
                  <el-table-column prop="originalFile.name" label="文件名" min-width="180" show-overflow-tooltip />
                  <el-table-column label="原始大小" width="100">
                    <template #default="{ row }">
                      {{ formatBytes(row.originalSize) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="压缩后大小" width="100">
                    <template #default="{ row }">
                      {{ formatBytes(row.compressedSize) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="压缩率" width="100">
                    <template #default="{ row }">
                      <span class="text-green-500">-{{ row.compressionRatio.toFixed(1) }}%</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="80">
                    <template #default>
                      <el-tag type="success" size="small">完成</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
             </div>
          </div>

          <!-- 下载操作 -->
          <div class="mt-4 flex flex-wrap gap-3 justify-center">
            <DownloadButton 
              v-if="mode === 'single' && result && !isCompressing" 
              @download="downloadImage"
            />
            <el-button 
              v-if="mode === 'batch' && resultList.length && !isCompressing"
              type="primary"
              size="large"
              @click="downloadAll"
            >
              批量下载压缩后图片
            </el-button>
            <el-button 
              v-if="mode === 'batch' && resultList.length && !isCompressing && state.currentFolderItems.length"
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

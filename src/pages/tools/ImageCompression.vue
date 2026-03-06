<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
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

const compressionStatus = ref<'idle' | 'ready' | 'compressing' | 'done'>('idle')

const suggestion = computed(() => {
  if (mode.value === 'single' && state.currentFile) {
    const file = state.currentFile
    const sizeMB = file.size / 1024 / 1024
    if (file.type === 'image/png') {
       if (sizeMB > 2) return '提示：该 PNG 图片较大，建议选择“体积优先”或将输出格式改为 WebP 以大幅减小体积。'
       return '提示：PNG 图片建议转换为 WebP 格式以在保持透明度的同时获得更好压缩率。'
    }
    if (sizeMB > 5) {
      return '提示：文件较大 (>5MB)，建议选择“体积优先”模式。'
    }
  }
  return ''
})

const hasFiles = computed(() => {
  return !!state.currentFile || state.currentFiles.length > 0 || state.currentFolderItems.length > 0
})

const handleModeChange = (newMode: 'single' | 'batch') => {
  state.currentFile = null
  state.currentFiles = []
  state.currentFolderItems = []
  result.value = null
  resultList.value = []
  compressionStatus.value = 'idle'
}

const handleFileSelected = (file: File) => {
  state.currentFile = file
  compressionStatus.value = 'ready'
  result.value = null // Clear previous result
}

const handleFilesSelected = (files: File[]) => {
  state.currentFiles = files
  compressionStatus.value = 'ready'
  resultList.value = [] // Clear previous results
}

const handleFolderSelected = (items: { file: File; relativePath: string }[]) => {
  state.currentFolderItems = items
  compressionStatus.value = 'ready'
  resultList.value = [] // Clear previous results
}

const handleOptionsChanged = (newOptions: any) => {
  state.options = { ...state.options, ...newOptions }
  // Do not auto-trigger compression anymore
}

const startCompression = async () => {
  compressionStatus.value = 'compressing'
  try {
    if (mode.value === 'single') {
       await triggerCompression()
    } else {
      if (state.currentFolderItems.length) {
        await triggerFolderCompression()
      } else {
        await triggerBatchCompression()
      }
    }
    compressionStatus.value = 'done'
  } catch (e) {
    console.error(e)
    compressionStatus.value = 'ready' // Revert on error
  }
}

const triggerCompression = async () => {
  if (state.currentFile) {
    await compressImage(state.currentFile, state.options)
  }
}

const triggerBatchCompression = async () => {
  if (state.currentFiles.length) {
    // Batch mode: skip preview generation
    await compressImages(state.currentFiles, state.options, false)
  }
}

const triggerFolderCompression = async () => {
  if (state.currentFolderItems.length) {
    // Folder/Batch mode: skip preview generation
    await compressImagesWithPaths(state.currentFolderItems, state.options, false)
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
        
        <div v-if="suggestion" class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 p-3 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
          <div class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>{{ suggestion }}</span>
          </div>
        </div>

        <CompressionSettings 
          :loading="isCompressing"
          @options-changed="handleOptionsChanged"
        />

        <div v-if="hasFiles" class="pt-2">
          <el-button 
            type="primary" 
            size="large" 
            class="w-full" 
            :loading="isCompressing"
            @click="startCompression"
          >
            {{ isCompressing ? '正在压缩...' : '开始压缩' }}
          </el-button>
        </div>
      </div>

      <!-- Right Column: Preview & Action -->
      <div class="lg:col-span-2">
        <div v-if="!hasFiles" class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
           <p class="text-gray-400">请先上传图片</p>
        </div>

        <div v-else>
          <!-- Ready State: Show File Info Only -->
          <div v-if="compressionStatus === 'ready'" class="bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
            <div class="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-gray-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
              已选择 
              <span v-if="mode === 'single' && state.currentFile">{{ state.currentFile.name }} ({{ formatBytes(state.currentFile.size) }})</span>
              <span v-else>{{ state.currentFiles.length + state.currentFolderItems.length }} 张图片</span>
            </p>
            <p class="text-gray-500 mt-2">请调整左侧设置并点击“开始压缩”</p>
          </div>

          <div v-else-if="compressionStatus === 'compressing' || compressionStatus === 'done'">
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
  </div>
</template>

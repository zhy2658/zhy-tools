<script setup lang="ts">
import { computed } from 'vue'


const props = defineProps<{
  originalUrl: string
  compressedUrl: string
  originalSize: number
  compressedSize: number
}>()

const compressionRatio = computed(() => {
  const ratio = (1 - props.compressedSize / props.originalSize) * 100
  return ratio.toFixed(2) + '%'
})

// Quick util if not exists
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 字节'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['字节', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    <!-- Original -->
    <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="mb-2 flex justify-between items-center">
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">原图</span>
        <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatBytes(originalSize) }}</span>
      </div>
      <div class="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative">
        <img :src="originalUrl" class="max-w-full max-h-full object-contain" alt="原图" />
      </div>
    </div>

    <!-- Compressed -->
    <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="mb-2 flex justify-between items-center">
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">压缩后</span>
        <div class="flex items-center gap-2">
           <el-tag type="success" size="small">-{{ compressionRatio }}</el-tag>
           <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatBytes(compressedSize) }}</span>
        </div>
      </div>
      <div class="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative">
        <img :src="compressedUrl" class="max-w-full max-h-full object-contain" alt="压缩后" />
      </div>
    </div>
  </div>
</template>

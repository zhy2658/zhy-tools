<script setup lang="ts">
import { reactive, watch, ref } from 'vue'

const { loading } = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'options-changed', options: any): void
}>()

type CompressionLevel = 'balanced' | 'quality' | 'aggressive' | 'custom'

const compressionLevel = ref<CompressionLevel>('balanced')

const options = reactive({
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  initialQuality: 0.8,
  useWebWorker: true,
  fileType: undefined as string | undefined,
})

const presets: Record<string, Partial<typeof options>> = {
  balanced: {
    maxSizeMB: 2,
    initialQuality: 0.8,
    maxWidthOrHeight: 2560
  },
  quality: {
    maxSizeMB: 10,
    initialQuality: 1,
    maxWidthOrHeight: 4096 // 4K
  },
  aggressive: {
    maxSizeMB: 0.5,
    initialQuality: 0.6,
    maxWidthOrHeight: 1280
  }
}

const handleLevelChange = (level: CompressionLevel) => {
  if (level !== 'custom') {
    const preset = presets[level]
    if (preset) {
      Object.assign(options, preset)
    }
  }
}

// Watch for manual changes to switch to 'custom'
watch(() => [options.maxSizeMB, options.maxWidthOrHeight, options.initialQuality], () => {
  // Check if current values match any preset
  let matched = false
  for (const [key, preset] of Object.entries(presets)) {
    if (
      options.maxSizeMB === preset.maxSizeMB &&
      options.initialQuality === preset.initialQuality &&
      options.maxWidthOrHeight === preset.maxWidthOrHeight
    ) {
      compressionLevel.value = key as CompressionLevel
      matched = true
      break
    }
  }
  if (!matched) {
    compressionLevel.value = 'custom'
  }
})

watch(options, (newVal) => {
  emit('options-changed', { ...newVal })
}, { deep: true })
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">压缩设置</h3>
    
    <el-form label-position="top">
      <el-form-item label="压缩模式">
        <el-radio-group v-model="compressionLevel" @change="handleLevelChange" :disabled="loading" class="w-full grid grid-cols-2 gap-2">
          <el-radio-button label="balanced" class="w-full">均衡 (推荐)</el-radio-button>
          <el-radio-button label="quality" class="w-full">画质优先</el-radio-button>
          <el-radio-button label="aggressive" class="w-full">体积优先</el-radio-button>
          <el-radio-button label="custom" class="w-full">自定义</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="输出格式">
        <el-select v-model="options.fileType" placeholder="保持原格式" class="w-full" :disabled="loading">
          <el-option label="保持原格式" :value="undefined" />
          <el-option label="JPEG" value="image/jpeg" />
          <el-option label="PNG" value="image/png" />
          <el-option label="WebP" value="image/webp" />
        </el-select>
      </el-form-item>

      <el-divider v-if="compressionLevel === 'custom'" content-position="center">高级设置</el-divider>

      <div v-if="compressionLevel === 'custom'" class="space-y-4 transition-all duration-300">
        <el-form-item label="最大文件大小（MB）">
          <div class="flex items-center gap-4 w-full">
            <el-slider 
              v-model="options.maxSizeMB" 
              :min="0.1" 
              :max="10" 
              :step="0.1" 
              :disabled="loading"
              class="flex-1"
            />
            <el-input-number 
              v-model="options.maxSizeMB" 
              :min="0.1" 
              :max="10" 
              :step="0.1" 
              size="small"
              :disabled="loading"
              class="w-24"
            />
          </div>
        </el-form-item>

        <el-form-item label="最大宽高（px）">
          <el-input-number 
            v-model="options.maxWidthOrHeight" 
            :min="100" 
            :max="8000" 
            :step="100" 
            :disabled="loading"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="质量（0-1）">
           <div class="flex items-center gap-4 w-full">
            <el-slider 
              v-model="options.initialQuality" 
              :min="0.1" 
              :max="1" 
              :step="0.1" 
              :disabled="loading"
               class="flex-1"
            />
            <span class="text-sm w-8">{{ options.initialQuality }}</span>
          </div>
        </el-form-item>
      </div>
      
      <div v-else class="text-sm text-gray-500 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
        <p v-if="compressionLevel === 'balanced'">平衡画质与体积，适合大多数场景。</p>
        <p v-if="compressionLevel === 'quality'">尽可能保留画质，仅做轻微压缩。</p>
        <p v-if="compressionLevel === 'aggressive'">牺牲画质以获得最小体积，适合缩略图。</p>
      </div>
    </el-form>
  </div>
</template>

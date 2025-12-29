<script setup lang="ts">
import { reactive, watch } from 'vue'

const { loading } = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'options-changed', options: any): void
}>()

const options = reactive({
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  initialQuality: 0.8,
  useWebWorker: true,
})

watch(options, (newVal) => {
  emit('options-changed', { ...newVal })
}, { deep: true })
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Settings</h3>
    
    <el-form label-position="top">
      <el-form-item label="Max Size (MB)">
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

      <el-form-item label="Max Width/Height (px)">
        <el-input-number 
          v-model="options.maxWidthOrHeight" 
          :min="100" 
          :max="8000" 
          :step="100" 
          :disabled="loading"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="Quality (0-1)">
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
    </el-form>
  </div>
</template>

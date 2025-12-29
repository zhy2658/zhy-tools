<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'

defineProps<{
  disabled?: boolean
}>()

defineEmits<{
  (e: 'download'): void
}>()
</script>

<template>
  <div class="mt-6 flex justify-center">
    <el-button 
      type="primary" 
      size="large" 
      :icon="Download" 
      :disabled="disabled"
      @click="$emit('download')"
      class="w-full md:w-auto px-8"
    >
      Download Compressed Image
    </el-button>
  </div>
</template>

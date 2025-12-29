<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const file = e.dataTransfer?.files[0]
  validateAndEmit(file)
}

const handleChange = (uploadFile: any) => {
  validateAndEmit(uploadFile.raw)
}

const validateAndEmit = (file?: File) => {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.error('Please upload an image file')
    return
  }

  emit('file-selected', file)
}
</script>

<template>
  <el-upload
    class="upload-demo"
    drag
    action="#"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleChange"
    accept="image/*"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip text-center">
        jpg/png/webp files with a size less than 10MB
      </div>
    </template>
  </el-upload>
</template>

<style scoped>
.upload-demo :deep(.el-upload-dragger) {
  background-color: transparent;
  border-color: var(--el-border-color);
}
.dark .upload-demo :deep(.el-upload-dragger:hover) {
  border-color: var(--el-color-primary);
}
</style>

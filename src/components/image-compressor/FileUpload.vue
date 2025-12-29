<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const handleChange = (uploadFile: any) => {
  validateAndEmit(uploadFile.raw)
}

const validateAndEmit = (file?: File) => {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
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
      将文件拖拽到此或<em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip text-center">
        支持 jpg/png/webp，文件大小不超过 10MB
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

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
  (e: 'files-selected', files: File[]): void
  (e: 'folder-selected', items: { file: File; relativePath: string }[]): void
}>()

const folderInputRef = ref<HTMLInputElement | null>(null)

const handleChange = (uploadFile: any, uploadFiles?: any[]) => {
  // 单个
  validateAndEmit(uploadFile?.raw)
  // 批量（支持多选）
  if (Array.isArray(uploadFiles) && uploadFiles.length) {
    const files: File[] = uploadFiles
      .map((uf: any) => uf.raw)
      .filter((f: File) => !!f && f.type?.startsWith('image/'))
    if (files.length) {
      emit('files-selected', files)
    }
  }
}

const validateAndEmit = (file?: File) => {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return
  }

  emit('file-selected', file)
}

const handleFolderPick = () => {
  folderInputRef.value?.click()
}

const handleFolderChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  const items = files
    .filter((f) => f.type.startsWith('image/'))
    .map((f) => ({
      file: f,
      relativePath: (f as any).webkitRelativePath || f.name,
    }))
  if (items.length) {
    emit('folder-selected', items)
  } else {
    ElMessage.warning('未检测到图片文件')
  }
  if (folderInputRef.value) folderInputRef.value.value = ''
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
    multiple
    accept="image/*"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      将图片拖拽到此或<em>点击上传</em>（可多选）
    </div>
    <template #tip>
      <div class="el-upload__tip text-center">
        支持 jpg/png/webp，单文件大小不超过 10MB
      </div>
    </template>
  </el-upload>
  <div class="mt-3 flex justify-center">
    <el-button type="primary" plain @click="handleFolderPick">选择文件夹进行批量压缩（保留目录）</el-button>
    <input
      ref="folderInputRef"
      type="file"
      webkitdirectory
      multiple
      accept="image/*"
      style="display:none"
      @change="handleFolderChange"
    />
  </div>
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

<script setup lang="ts">
import { ref } from 'vue'
import ToolCard from '@/components/ToolCard.vue'

interface Tool {
  id: string
  name: string
  description: string
  icon: string
  route: string
  category: string
}

const tools = ref<Tool[]>([
  {
    id: 'image-compression',
    name: '图片压缩',
    description: '在线压缩图片体积，尽量保持清晰度。支持 JPEG、PNG、WebP。',
    icon: 'Picture',
    route: '/tools/image-compression',
    category: '图片'
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '美化与校验 JSON 数据（即将推出）',
    icon: 'Document',
    route: '/tools/json-formatter',
    category: '开发'
  },
  {
    id: 'color-picker',
    name: '取色器',
    description: '选择颜色并获取 HEX/RGB 值（即将推出）',
    icon: 'MagicStick',
    route: '/tools/color-picker',
    category: '设计'
  }
])
</script>

<template>
  <div class="py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-4 pb-2">
        前端工具合集
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        免费、简单、高效的在线工具集合。所有处理均在浏览器本地完成，保障隐私。
      </p>
    </div>

    <!-- Tools Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ToolCard 
        v-for="tool in tools" 
        :key="tool.id" 
        :tool="tool" 
      />
    </div>
  </div>
</template>

<style scoped>
.from-primary {
  --tw-gradient-from: var(--el-color-primary);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
</style>

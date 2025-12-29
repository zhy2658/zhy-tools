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
    name: 'Image Compression',
    description: 'Compress image size online without losing quality. Supports JPEG, PNG, WebP.',
    icon: 'Picture',
    route: '/tools/image-compression',
    category: 'Image'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Beautify and validate JSON data. (Coming Soon)',
    icon: 'Document',
    route: '/tools/json-formatter',
    category: 'Dev'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and get hex/rgb values. (Coming Soon)',
    icon: 'MagicStick',
    route: '/tools/color-picker',
    category: 'Design'
  }
])
</script>

<template>
  <div class="py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-4 pb-2">
        Online Developer Tools
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        A collection of free, simple, and efficient online tools for developers and designers.
        Processing happens locally in your browser for privacy.
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

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import * as Icons from '@element-plus/icons-vue'

const props = defineProps<{
  tool: {
    id: string
    name: string
    description: string
    icon: string
    route: string
    category: string
  }
}>()

const router = useRouter()

const handleClick = () => {
  router.push(props.tool.route)
}

// Dynamically get icon component
const iconComponent = computed(() => {
  return (Icons as any)[props.tool.icon] || Icons.Tools
})
</script>

<template>
  <div 
    class="tool-card group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
    @click="handleClick"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        <el-icon :size="24">
          <component :is="iconComponent" />
        </el-icon>
      </div>
      <el-tag size="small" effect="plain" round>{{ tool.category }}</el-tag>
    </div>
    
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
      {{ tool.name }}
    </h3>
    
    <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
      {{ tool.description }}
    </p>
  </div>
</template>

<style scoped>
.bg-primary\/10 {
  background-color: var(--el-color-primary-light-9);
}
.text-primary {
  color: var(--el-color-primary);
}
.group-hover\:bg-primary:hover {
  background-color: var(--el-color-primary);
}
</style>

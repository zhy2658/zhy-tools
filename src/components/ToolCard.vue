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
  <div class="tool-card" @click="handleClick">
    <div class="card-header">
      <div class="icon-wrapper">
        <el-icon :size="24">
          <component :is="iconComponent" />
        </el-icon>
      </div>
      <el-tag size="small" effect="plain" round>{{ tool.category }}</el-tag>
    </div>
    
    <h3 class="tool-title">
      {{ tool.name }}
    </h3>
    
    <p class="tool-desc">
      {{ tool.description }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.tool-card {
  background-color: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: var(--el-box-shadow);
    transform: translateY(-4px);
    
    .icon-wrapper {
      background-color: var(--el-color-primary);
      color: #fff;
    }
    
    .tool-title {
      color: var(--el-color-primary);
    }
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.icon-wrapper {
  padding: 12px;
  border-radius: 8px;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
  transition: color 0.3s;
}

.tool-desc {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Moon, Sunny } from '@element-plus/icons-vue'

const { isDark, toggleDark } = useTheme()
</script>

<template>
  <el-button
    class="theme-toggle"
    :icon="isDark ? Moon : Sunny"
    circle
    @click="toggleDark()"
    title="Toggle Theme"
  />
</template>

<style scoped>
.theme-toggle {
  transition: all 0.3s;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center gap-2">
            <el-icon :size="24" class="text-primary"><Tools /></el-icon>
            <span class="text-xl font-bold text-gray-900 dark:text-white">工具箱</span>
          </router-link>
          
          <!-- Desktop Menu -->
          <div class="hidden md:block ml-10">
            <div class="flex items-baseline space-x-4">
              <router-link 
                to="/" 
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="bg-primary/10 text-primary dark:text-primary-light"
                :class="[$route.path === '/' ? '' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800']"
              >
                首页
              </router-link>
              <router-link 
                to="/about" 
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                active-class="bg-primary/10 text-primary dark:text-primary-light"
                :class="[$route.path === '/about' ? '' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800']"
              >
                关于
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <a href="https://github.com/zhy2658/zhy-tools" target="_blank" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <el-icon :size="20"><Link /></el-icon>
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <ThemeToggle class="mr-2" />
          <button 
            @click="toggleMenu" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          >
            <el-icon :size="24">
              <Close v-if="isMenuOpen" />
              <Menu v-else />
            </el-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="isMenuOpen" class="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link 
          to="/" 
          class="block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-primary/10 text-primary"
          :class="[$route.path === '/' ? '' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800']"
          @click="isMenuOpen = false"
        >
          首页
        </router-link>
        <router-link 
          to="/about" 
          class="block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-primary/10 text-primary"
          :class="[$route.path === '/about' ? '' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800']"
          @click="isMenuOpen = false"
        >
          关于
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.text-primary {
  color: var(--el-color-primary);
}
.bg-primary\/10 {
  background-color: var(--el-color-primary-light-9);
}
.dark .bg-primary\/10 {
  background-color: var(--el-color-primary-dark-2);
}
.dark .text-primary-light {
  color: var(--el-color-primary-light-3);
}
</style>

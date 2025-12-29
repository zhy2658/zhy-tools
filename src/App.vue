<script setup lang="ts">
import HeaderNav from '@/components/HeaderNav.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeaderNav />
    
    <main class="flex-grow pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="mt-auto py-8 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {{ new Date().getFullYear() }} ToolBox. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

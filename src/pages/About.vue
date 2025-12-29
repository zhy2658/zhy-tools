<template>
  <div class="max-w-3xl mx-auto py-12">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">关于工具箱</h1>
      
      <div class="prose dark:prose-invert max-w-none">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          工具箱是为开发者与设计师打造的现代化在线工具集合，旨在提升日常工作效率。
        </p>

        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">特性</h2>
        <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
          <li><strong>隐私优先：</strong>所有处理均在浏览器本地完成，不上传任何数据。</li>
          <li><strong>现代界面：</strong>基于 Vue 3、TypeScript 与 Element Plus，体验顺滑。</li>
          <li><strong>暗黑模式：</strong>完整支持暗夜模式，夜间使用更舒适。</li>
          <li><strong>响应式：</strong>在桌面、平板与手机端均有良好表现。</li>
        </ul>

        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">技术栈</h2>
        <div class="flex flex-wrap gap-2">
          <el-tag>Vue 3</el-tag>
          <el-tag type="success">TypeScript</el-tag>
          <el-tag type="warning">Vite</el-tag>
          <el-tag type="info">Element Plus</el-tag>
          <el-tag type="danger">Tailwind CSS</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="max-w-3xl mx-auto py-12">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">About ToolBox</h1>
      
      <div class="prose dark:prose-invert max-w-none">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          ToolBox is a modern collection of web-based utilities designed to help developers and designers with their daily tasks.
        </p>

        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">Features</h2>
        <ul class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
          <li><strong>Privacy First:</strong> All processing happens locally in your browser. No data is sent to servers.</li>
          <li><strong>Modern UI:</strong> Built with Vue 3, TypeScript, and Element Plus for a smooth experience.</li>
          <li><strong>Dark Mode:</strong> Fully supported dark mode for comfortable usage at night.</li>
          <li><strong>Responsive:</strong> Works great on desktop, tablet, and mobile devices.</li>
        </ul>

        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">Tech Stack</h2>
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

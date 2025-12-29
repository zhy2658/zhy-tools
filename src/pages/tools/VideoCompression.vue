<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { ElMessage } from 'element-plus'
import { UploadFilled, VideoPlay, Download, Setting } from '@element-plus/icons-vue'

const ffmpeg = new FFmpeg()
const loaded = ref(false)
const progress = ref(0)
const logMessage = ref('')
const videoFile = ref<File | null>(null)
const videoUrl = ref('')
const compressedVideoUrl = ref('')
const isCompressing = ref(false)
const fileSize = ref(0)
const compressedSize = ref(0)

const settings = ref({
  resolution: '720',
  quality: 'medium',
  format: 'mp4'
})

const resolutionOptions = [
  { label: '原始分辨率', value: 'original' },
  { label: '1080p', value: '1080' },
  { label: '720p', value: '720' },
  { label: '480p', value: '480' }
]

const qualityOptions = [
  { label: '高质量 (大文件)', value: 'high' },
  { label: '中等质量 (平衡)', value: 'medium' },
  { label: '低质量 (小文件)', value: 'low' }
]

const loadFFmpeg = async () => {
  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    loaded.value = true
    ffmpeg.on('progress', ({ progress: p }) => {
      progress.value = Math.min(Math.round(p * 100), 100)
    })
    ffmpeg.on('log', ({ message }) => {
      logMessage.value = message
    })
  } catch (error) {
    console.error(error)
    ElMessage.error('FFmpeg 加载失败，请检查网络连接或浏览器兼容性')
  }
}

onMounted(() => {
  loadFFmpeg()
})

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileChange = (file: any) => {
  if (file.raw.type.indexOf('video/') === -1) {
    ElMessage.error('请上传视频文件')
    return
  }
  videoFile.value = file.raw
  fileSize.value = file.raw.size
  videoUrl.value = URL.createObjectURL(file.raw)
  compressedVideoUrl.value = ''
  compressedSize.value = 0
  progress.value = 0
}

const compressVideo = async () => {
  if (!videoFile.value) return
  isCompressing.value = true
  progress.value = 0
  
  try {
    const { resolution, quality } = settings.value
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile.value))
    
    let args = ['-i', 'input.mp4']
    
    // Resolution
    if (resolution !== 'original') {
      // Ensure width/height are divisible by 2
      args.push('-vf', `scale=-2:${resolution}`)
    }
    
    // Quality (CRF)
    let crf = '23'
    if (quality === 'high') crf = '18'
    if (quality === 'medium') crf = '23'
    if (quality === 'low') crf = '28'
    
    args.push('-c:v', 'libx264', '-crf', crf, '-preset', 'ultrafast')
    args.push('-c:a', 'aac', '-b:a', '128k')
    args.push('output.mp4')
    
    await ffmpeg.exec(args)
    
    const data = await ffmpeg.readFile('output.mp4')
    const blob = new Blob([data], { type: 'video/mp4' })
    compressedVideoUrl.value = URL.createObjectURL(blob)
    compressedSize.value = blob.size
    
    ElMessage.success('视频压缩完成')
  } catch (e) {
    console.error(e)
    ElMessage.error('压缩失败，请重试')
  } finally {
    isCompressing.value = false
  }
}
</script>

<template>
  <div class="video-compress-container">
    <div class="header-section">
      <h1>视频压缩</h1>
      <p>使用浏览器本地 FFmpeg 技术，安全高效地压缩视频体积。</p>
      <el-alert
        v-if="!loaded"
        title="正在加载压缩核心组件，初次加载可能需要一点时间..."
        type="warning"
        :closable="false"
        show-icon
        class="mt-4"
      />
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :lg="8">
        <el-card class="box-card upload-card">
          <template #header>
            <div class="card-header">
              <span>上传视频</span>
            </div>
          </template>
          
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            accept="video/*"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽视频到此处或 <em>点击上传</em>
            </div>
          </el-upload>

          <div v-if="videoFile" class="file-info">
            <p><strong>文件名:</strong> {{ videoFile.name }}</p>
            <p><strong>大小:</strong> {{ formatSize(fileSize) }}</p>
          </div>

          <el-divider />

          <div class="settings-form">
            <h3>压缩设置</h3>
            <el-form label-position="top">
              <el-form-item label="分辨率">
                <el-select v-model="settings.resolution" placeholder="选择分辨率" style="width: 100%">
                  <el-option
                    v-for="item in resolutionOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="压缩质量">
                <el-select v-model="settings.quality" placeholder="选择质量" style="width: 100%">
                  <el-option
                    v-for="item in qualityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-button 
                type="primary" 
                size="large" 
                style="width: 100%" 
                @click="compressVideo"
                :loading="isCompressing"
                :disabled="!loaded || !videoFile"
              >
                {{ isCompressing ? '压缩中...' : '开始压缩' }}
              </el-button>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="16">
        <el-card class="box-card preview-card">
          <template #header>
            <div class="card-header">
              <span>预览与下载</span>
            </div>
          </template>

          <div v-if="!videoUrl" class="empty-preview">
            <el-empty description="请先上传视频" />
          </div>

          <div v-else class="video-preview-container">
            <el-row :gutter="20">
              <el-col :span="12" :xs="24">
                <div class="preview-box">
                  <div class="label">原视频</div>
                  <video :src="videoUrl" controls></video>
                </div>
              </el-col>
              <el-col :span="12" :xs="24">
                <div class="preview-box">
                  <div class="label">压缩后</div>
                  <div v-if="!compressedVideoUrl" class="waiting-box">
                    <span v-if="isCompressing">处理中...</span>
                    <span v-else>等待处理</span>
                  </div>
                  <video v-else :src="compressedVideoUrl" controls></video>
                </div>
              </el-col>
            </el-row>

            <div v-if="isCompressing" class="progress-section">
              <p>处理进度: {{ progress }}%</p>
              <el-progress :percentage="progress" :status="progress === 100 ? 'success' : ''" />
              <p class="log-text">{{ logMessage }}</p>
            </div>

            <div v-if="compressedVideoUrl" class="result-actions">
              <el-alert
                title="压缩成功"
                type="success"
                :description="`大小从 ${formatSize(fileSize)} 压缩到 ${formatSize(compressedSize)}，减少了 ${((fileSize - compressedSize) / fileSize * 100).toFixed(1)}%`"
                show-icon
                :closable="false"
                class="mb-4"
              />
              <a :href="compressedVideoUrl" download="compressed_video.mp4" class="download-link">
                <el-button type="success" size="large" :icon="Download">
                  下载压缩后的视频
                </el-button>
              </a>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.video-compress-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  margin-bottom: 30px;
  h1 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: var(--el-text-color-primary);
  }
  p {
    color: var(--el-text-color-secondary);
  }
}

.box-card {
  margin-bottom: 20px;
}

.file-info {
  margin-top: 15px;
  padding: 10px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  p {
    margin: 5px 0;
    font-size: 0.9rem;
    color: var(--el-text-color-regular);
  }
}

.settings-form {
  h3 {
    margin-bottom: 15px;
    font-size: 1.1rem;
    color: var(--el-text-color-primary);
  }
}

.empty-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.video-preview-container {
  .preview-box {
    margin-bottom: 20px;
    .label {
      font-weight: bold;
      margin-bottom: 8px;
      color: var(--el-text-color-primary);
    }
    video {
      width: 100%;
      max-height: 300px;
      background: #000;
      border-radius: 8px;
    }
    .waiting-box {
      width: 100%;
      height: 200px;
      background-color: var(--el-fill-color-light);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      color: var(--el-text-color-secondary);
    }
  }
}

.progress-section {
  margin-top: 20px;
  padding: 15px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 8px;
  .log-text {
    font-size: 0.8rem;
    color: var(--el-text-color-secondary);
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.result-actions {
  margin-top: 20px;
  text-align: center;
  .download-link {
    text-decoration: none;
  }
}

.mb-4 {
  margin-bottom: 1rem;
}
.mt-4 {
  margin-top: 1rem;
}
</style>

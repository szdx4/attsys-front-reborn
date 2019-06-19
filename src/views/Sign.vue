<template>
  <section>
    <el-row :gutter="20">
      <el-col :span="6" :offset="6">
        <h3 align="center">扫描二维码签到</h3>
        <img :src="qrcode" height="256px" width="256px" />
      </el-col>
      <el-col :span="6">
        <h3 align="center">人脸识别签到</h3>
        <video id="video" width="256px" height="256px" autoplay="autoplay" />
        <el-button type="primary" @click="faceSign" style="width: 256px"
          >签到</el-button
        >
        <canvas
          id="canvas"
          width="256px"
          height="256px"
          style="display: none;"
        />
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { isManager, isMaster } from '@/utils/user'
import { getSignQrcode, faceSign } from '@/requests/sign'

export default {
  name: 'sign',
  mounted () {
    if (!isManager() && !isMaster()) {
      this.$router.push({ path: '/home' })
    }

    this.loadQrcode()
    this.openCam()
  },
  destroyed () {
    this.closeCam()
  },
  data () {
    return {
      qrcode: '',
      stream: ''
    }
  },
  methods: {
    loadQrcode () {
      getSignQrcode().then(res => {
        this.qrcode = res.data.data.qrcode

        let expiredAt = new Date(res.data.data.expired_at)
        let current = new Date()
        setTimeout(this.loadQrcode, expiredAt - current)

        this.$notify({
          title: '提示',
          message: '获取签到二维码成功',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取签到二维码失败'
        })
      })
    },
    openCam () {
      const constraints = {
        video: { width: 256, height: 256 },
        audio: false
      }
      const video = document.getElementById('video')
      const promise = navigator.mediaDevices.getUserMedia(constraints)
      promise.then((MediaStream) => {
        this.stream = MediaStream
        video.srcObject = this.stream
        video.play()

        this.$notify({
          title: '提示',
          message: '摄像头开启成功',
          type: 'success'
        })
      })
    },
    closeCam () {
      let track = this.stream.getTracks()[0]
      track.stop()
      const video = document.getElementById('video')
      video.src = ''
    },
    faceSign () {
      const video = document.getElementById('video')
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, 256, 256)
      let imageData = canvas.toDataURL()

      faceSign(imageData).then(res => {
        this.$notify({
          title: '提示',
          message: '用户 ' + res.data.user.name + ' 签到成功',
          type: 'success'
        })
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '签到失败'
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>

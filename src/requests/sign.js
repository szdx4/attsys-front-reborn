import { request } from '@/utils/request'

export function getSignQrcode () {
  return request('get', '/sign/qrcode')
}

export function faceSign (image) {
  return request('post', '/sign/face', {
    face: image
  })
}

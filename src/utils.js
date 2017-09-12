/**
 * [ timeFormat 格式化 time 为 YYYY-MM-DD HH:mm 格式 ]
 * @param time [ 时间戳或标准时间格式，如：Fri, 11 Aug 2017 18:06:04 CST +08:00 | 1502445964000 | 1502445964 ]
 * @returns {string}
 */
export const timeFormat = (time) => {
  const formatTime = typeof time === 'number'
    ? time.toString().length === 13 ? time : time * 1000
    : time
  const date = new Date(formatTime)
  return `${date.getFullYear()}-${(`0${date.getMonth() + 1}`).substr(-2)}-${(`0${date.getDate()}`).substr(-2)} ${(`0${date.getHours()}`).substr(-2)}:${(`0${date.getMinutes()}`).substr(-2)}`
}

/**
 * [ timeAgo 格式化文章发布时间 ]
 * [ 依赖 timeFormat ]
 * @param time
 * @returns {string}
 */
export const timeAgo = (time) => {
  const ctxTime = new Date(time)
  const curTime = new Date()
  const ctxTimestamp = ctxTime.getTime()
  const curTimestamp = curTime.getTime()
  const today = new Date().setHours(0, 0, 0, 0)
  const delta = (curTimestamp - ctxTimestamp) / 1000
  const deltaDay = (today - ctxTimestamp) / 86400000
  if (deltaDay < 0) {
    if (delta < 60) {
      return '几秒前'
    } else if (delta < 3600) {
      return `${parseInt(delta / 60, 10)}分钟前`
    }
    return `${parseInt(delta / 3600, 10)}小时前`
  }
  const compute = timeFormat(ctxTimestamp).replace(/-/g, '.')
  if (ctxTime.getFullYear() !== curTime.getFullYear()) {
    return compute // YYYY.MM.DD HH:mm (今年以前)
  } else if (deltaDay > 2) {
    return compute.substr(5) // MM.DD HH:mm (前天之前)
  } else if (deltaDay > 1) {
    return `前天 ${compute.substr(11)}` // 前天 HH:mm
  }
  return `昨天 ${compute.substr(11)}` // 昨天 HH:mm
}

export const canUseWebP = () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.supportWebP !== undefined) {
    return window.supportWebP
  }

  const ele = document.createElement('canvas')

  if (ele.getContext && ele.getContext('2d')) {
    return window.supportWebP = ele.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  return false
}

export const getRGB = (image, blockSize = 5) => {
  const rgb = { r: 0, g: 0, b: 0 }

  if (typeof window === 'undefined') {
    return rgb
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext && canvas.getContext('2d')

  height = canvas.height = image.naturalHeight || image.offsetHeight || image.height
  width = canvas.width = image.naturalWidth || image.offsetWidth || image.width

  try {
    context.drawImage(image, 0, 0, width, height)
  } catch (e) {
    return rgb
  }
  try {
    data = context.getImageData(0, 0, width, height)
  } catch (e) {
    return rgb
  }

  length = data.data.length

  while ((i += blockSize * 4) < length) {
    ++count
    rgb.r += data.data[i]
    rgb.g += data.data[i + 1]
    rgb.b += data.data[i + 2]
  }

  rgb.r = ~~(rgb.r / count)
  rgb.g = ~~(rgb.g / count)
  rgb.b = ~~(rgb.b / count)
  return rgb
}

export const getRating = (rating) => {
  if (rating > 5 || rating < 0) throw new Error('数字不在范围内');
  return '★★★★★☆☆☆☆☆'.substring(5 - rating, 10 - rating);
}

export const strRepeat = (str, n) => new Array(n + 1).join(str)

export const strStat = (str) => str.split('').reduce((p, k) => (p[k]++ || (p[k] = 1), p), {})

export const debug = () => [].forEach.call($$('*'), (a) => {a.style.outline = '1px solid #' + (~~(Math.random() * (1 << 24))).toString(16)})

export const parseCookie = (prototype = document.cookie, name) => {
  const cookies = {};
  prototype.split('; ').forEach(item => {
    const temp = item.split('=')
    cookies[temp[0]] = temp[1]
  })
  return name ? cookies[name] : cookies;
}

export const eventManager = (function () {
  class Manager {
    constructor () {
      this.id = 0
      this.listeners = {}
    }

    add (ele, evt, handler, capture = false) {
      const id = this.id++
      ele.addEventListener(evt, handler, capture)
      this.listeners[id] = {
        element: ele,
        event: evt,
        handler,
        capture
      }
      return id
    }

    del (id) {
      if (this.listeners[id]) {
        const h = this.listeners[id]
        h.element.removeEventListener(h.event, h.handler, h.capture)
        Reflect.deleteProperty(this.listeners, id)
      }
    }
  }

  return new Manager()
}())

export const shuffle = (array) => {
  for (let i = array.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [array[i - 1], array[j]] = [array[j], array[i - 1]];
  }

  return array
}
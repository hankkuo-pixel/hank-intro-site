<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 800,
  },
  delay: {
    type: Number,
    default: 0,
  },
})

const output = ref(props.text)
let frame = 0
let timer = 0
let delayTimer = 0
const chars = '!<>-_\\/[]{}=+*^?#________'

function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)]
}

function run() {
  window.clearInterval(timer)
  window.clearTimeout(delayTimer)

  if (!props.active) {
    output.value = props.text
    return
  }

  output.value = props.text
    .split('')
    .map((char) => (char === ' ' ? ' ' : randomChar()))
    .join('')

  delayTimer = window.setTimeout(() => {
    frame = 0
    const totalFrames = Math.max(1, Math.round(props.duration / 32))
    timer = window.setInterval(() => {
      frame += 1
      const progress = frame / totalFrames
      output.value = props.text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' '
          if (index / props.text.length < progress) return char
          return randomChar()
        })
        .join('')

      if (frame >= totalFrames) {
        output.value = props.text
        window.clearInterval(timer)
      }
    }, 32)
  }, props.delay)
}

watch(() => [props.text, props.active], run, { immediate: true })

onBeforeUnmount(() => {
  window.clearInterval(timer)
  window.clearTimeout(delayTimer)
})
</script>

<template>
  <span>{{ output }}</span>
</template>

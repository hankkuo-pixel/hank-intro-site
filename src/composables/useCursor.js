import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

export function useCursor() {
  const position = reactive({ x: 0, y: 0 })
  const target = reactive({ x: 0, y: 0 })
  const isInteractive = ref(false)
  const isTouch = ref(false)
  let raf = 0

  function tick() {
    position.x += (target.x - position.x) * 0.12
    position.y += (target.y - position.y) * 0.12
    raf = window.requestAnimationFrame(tick)
  }

  function onMove(event) {
    target.x = event.clientX
    target.y = event.clientY
  }

  function onOver(event) {
    isInteractive.value = Boolean(event.target.closest('button, a, [role="button"]'))
  }

  onMounted(() => {
    isTouch.value = window.matchMedia('(hover: none), (pointer: coarse)').matches
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    raf = window.requestAnimationFrame(tick)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerover', onOver)
    window.cancelAnimationFrame(raf)
  })

  return {
    position,
    target,
    isInteractive,
    isTouch,
  }
}

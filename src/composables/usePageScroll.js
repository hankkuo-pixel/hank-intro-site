import { onBeforeUnmount, onMounted, ref } from 'vue'

const PAGE_DURATION = 900
const LOCK_EXTRA = 150
const WHEEL_IDLE = 120

export function usePageScroll(sections) {
  const currentIndex = ref(0)
let locked = false
let wheelIdleTimer = 0
let wheelQuiet = true
let touchStartX = 0
let touchStartY = 0

  function lockInput() {
    locked = true
    window.setTimeout(() => {
      locked = false
    }, PAGE_DURATION + LOCK_EXTRA)
  }

  function setHash(index) {
    const id = sections[index]?.id
    if (!id) return
    const nextHash = `#${id}`
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash)
    }
  }

  function goTo(index, options = {}) {
    const lastIndex = sections.length - 1
    let nextIndex = index

    if (nextIndex > lastIndex) nextIndex = 0
    if (nextIndex < 0) nextIndex = 0
    if (nextIndex === currentIndex.value && !options.force) return

    currentIndex.value = nextIndex
    setHash(nextIndex)
    lockInput()
  }

  function next() {
    goTo(currentIndex.value + 1)
  }

  function prev() {
    goTo(currentIndex.value - 1)
  }

  function onWheel(event) {
    event.preventDefault()

    const wasQuiet = wheelQuiet
    wheelQuiet = false
    window.clearTimeout(wheelIdleTimer)
    wheelIdleTimer = window.setTimeout(() => {
      wheelQuiet = true
    }, WHEEL_IDLE)

    if (locked || !wasQuiet) return
    if (Math.abs(event.deltaY) <= 25) return

    if (event.deltaY > 0) next()
    else prev()
  }

  function onTouchStart(event) {
    const touch = event.touches[0]
    touchStartX = touch.clientX
    touchStartY = touch.clientY
  }

  function onTouchEnd(event) {
    if (locked) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStartX
    const dy = touch.clientY - touchStartY

    if (Math.abs(dx) > Math.abs(dy)) return
    if (Math.abs(dy) <= 50) return

    if (dy < 0) next()
    else prev()
  }

  function onKeyDown(event) {
    if (locked && !['Home', 'End'].includes(event.key)) return

    const keys = ['ArrowDown', 'PageDown', ' ', 'ArrowUp', 'PageUp', 'Home', 'End']
    if (!keys.includes(event.key)) return

    event.preventDefault()

    if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') next()
    if (event.key === 'ArrowUp' || event.key === 'PageUp') prev()
    if (event.key === 'Home') goTo(0)
    if (event.key === 'End') goTo(sections.length - 1)
  }

  function syncFromHash() {
    const id = window.location.hash.replace('#', '')
    const hashIndex = sections.findIndex((section) => section.id === id)
    if (hashIndex >= 0) {
      currentIndex.value = hashIndex
    } else {
      setHash(0)
    }
  }

  onMounted(() => {
    syncFromHash()
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('hashchange', syncFromHash)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('hashchange', syncFromHash)
    window.clearTimeout(wheelIdleTimer)
  })

  return {
    currentIndex,
    goTo,
  }
}

import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useClock() {
  const time = ref('')
  let timer = 0

  function update() {
    const now = new Date()
    time.value = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Taipei',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now)
  }

  onMounted(() => {
    update()
    timer = window.setInterval(update, 1000)
  })

  onBeforeUnmount(() => {
    window.clearInterval(timer)
  })

  return time
}

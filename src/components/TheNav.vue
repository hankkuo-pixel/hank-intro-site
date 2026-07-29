<script setup>
import { computed } from 'vue'
import { useClock } from '@/composables/useClock'
import { useCursor } from '@/composables/useCursor'

const props = defineProps({
  currentIndex: {
    type: Number,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['go-to', 'toggle-theme'])

const time = useClock()
const { target } = useCursor()

const coordinates = computed(() => {
  const x = String(Math.round(target.x)).padStart(4, '0')
  const y = String(Math.round(target.y)).padStart(4, '0')
  return `${x} X ${y} Y`
})

const themeMark = computed(() => (props.theme === 'dark' ? 'A' : 'B'))

const navItems = [
  { label: 'WORK', index: 4 },
  { label: 'EXPERIENCE', index: 3 },
  { label: 'INTERESTS', index: 7 },
]
</script>

<template>
  <div class="chrome mono" aria-label="Site controls">
    <button class="corner top-left logo" type="button" @click="emit('go-to', 0)">
      HANK-KUO.COM
    </button>

    <nav class="corner top-right nav-links" aria-label="Primary">
      <button
        v-for="item in navItems"
        :key="item.label"
        type="button"
        :class="{ active: currentIndex === item.index }"
        @click="emit('go-to', item.index)"
      >
        {{ item.label }}
      </button>
      <button type="button" @click="emit('toggle-theme')">THEME[{{ themeMark }}]</button>
      <button type="button">SOUND[·]</button>
    </nav>

    <div class="corner bottom-left">GMT+8 TPE {{ time }}</div>
    <div class="corner bottom-center">{{ coordinates }}</div>
    <button class="corner bottom-right globe" type="button" aria-label="Language placeholder">
      ◎
    </button>
  </div>
</template>

<style scoped>
.chrome {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  font-size: 0.68rem;
  color: var(--label-1);
}

.corner {
  position: absolute;
  pointer-events: auto;
}

.top-left {
  top: 1.65rem;
  left: var(--page-pad-x);
}

.top-right {
  top: 1.65rem;
  right: var(--page-pad-x);
}

.bottom-left {
  bottom: 1.55rem;
  left: var(--page-pad-x);
}

.bottom-center {
  bottom: 1.55rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--label-2);
}

.bottom-right {
  bottom: 1.42rem;
  right: var(--page-pad-x);
  font-size: 1.35rem;
  line-height: 1;
}

.logo,
.nav-links button,
.globe {
  color: var(--label-1);
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(2.25rem, 6.8vw, 6.5rem);
}

.nav-links button {
  color: var(--label-1);
  transition: color var(--dur-hover);
}

.nav-links button:hover,
.nav-links button.active,
.logo:hover,
.globe:hover {
  color: var(--accent);
}

@media (max-width: 767px) {
  .nav-links {
    max-width: calc(100vw - 2rem);
    gap: 0.55rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .bottom-center {
    display: none;
  }
}
</style>

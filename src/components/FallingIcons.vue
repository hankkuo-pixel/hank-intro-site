<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'hero',
  },
})

const iconSets = {
  hero: ['✳', '▱', '◇', '✦', '○', '+'],
  work: ['AI', 'FIG', 'PS', 'AE', 'UX', '3D', 'API', 'CMS'],
  interests: ['DIVE', 'HIKE', 'SEA', 'FISH', 'FERN', 'PEAK', 'WAVE'],
}

const icons = iconSets[props.variant] ?? iconSets.hero
</script>

<template>
  <div class="falling-icons" :class="`falling-icons--${variant}`" aria-hidden="true">
    <span
      v-for="(icon, index) in icons"
      :key="`${variant}-${icon}-${index}`"
      class="falling-icon"
      :style="{ '--i': index }"
    >
      {{ icon }}
    </span>
  </div>
</template>

<style scoped>
.falling-icons {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
}

.falling-icon {
  --fall-x: 16px;
  --fall-y: 128px;
  --spin: 220deg;
  position: absolute;
  left: calc(16% + (var(--i) * 10.5%));
  top: calc(8% + ((var(--i) % 3) * 15%));
  display: grid;
  place-items: center;
  width: 2.15rem;
  height: 2.15rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.76);
  background: rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1;
  opacity: 0;
  transform: translate3d(0, -36px, 0) rotate(0deg);
  animation: iconFall 8.5s linear infinite;
  animation-delay: calc(var(--i) * -1.15s);
  backdrop-filter: blur(10px);
}

.falling-icon:nth-child(2n) {
  --fall-x: -22px;
  --spin: -190deg;
}

.falling-icon:nth-child(3n) {
  --fall-y: 164px;
}

.falling-icons--hero .falling-icon {
  left: calc(42% + (var(--i) * 7.5%));
  top: calc(13% + ((var(--i) % 4) * 11%));
  width: 1.75rem;
  height: 1.75rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.36);
  font-size: 1rem;
  backdrop-filter: none;
}

.falling-icons--work .falling-icon {
  border-color: rgba(14, 30, 84, 0.18);
  color: rgba(8, 18, 48, 0.72);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 18px 32px rgba(5, 10, 24, 0.08);
}

.falling-icons--interests .falling-icon {
  border-color: rgba(53, 96, 96, 0.22);
  color: rgba(16, 62, 63, 0.78);
  background: rgba(219, 249, 241, 0.68);
  box-shadow: 0 18px 32px rgba(4, 58, 65, 0.08);
}

.is-active .falling-icon {
  opacity: 1;
}

@keyframes iconFall {
  0% {
    transform: translate3d(0, -48px, 0) rotate(0deg);
    opacity: 0;
  }

  14%,
  72% {
    opacity: 1;
  }

  100% {
    transform: translate3d(var(--fall-x), var(--fall-y), 0) rotate(var(--spin));
    opacity: 0;
  }
}

@media (max-width: 767px) {
  .falling-icon {
    left: calc(8% + (var(--i) * 12%));
    width: 1.8rem;
    height: 1.8rem;
    font-size: 0.58rem;
  }

  .falling-icons--hero .falling-icon {
    left: calc(28% + (var(--i) * 9%));
  }
}
</style>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="ending-section" :class="{ 'is-active': active }">
    <div class="starfield" aria-hidden="true">
      <span v-for="index in 42" :key="index" :style="{ '--i': index }" />
    </div>
    <div class="section-inner ending-inner">
      <h1>
        <span
          v-for="(letter, index) in 'THANKS FOR SCROLLING'.split('')"
          :key="`${letter}-${index}`"
          :style="{ transitionDelay: `${index * 35}ms` }"
        >
          {{ letter === ' ' ? '\u00a0' : letter }}
        </span>
      </h1>
      <p class="fade-up" style="transition-delay: 700ms">
        看到這裡，大概就認識我了。再滾一次回到開頭。
      </p>
    </div>
  </div>
</template>

<style scoped>
.ending-section {
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #050606;
}

.starfield {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.starfield span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: clamp(5rem, 14vw, 12rem);
  transform:
    rotate(calc(var(--i) * 8.57deg))
    translateY(clamp(2rem, 10vw, 8rem))
    scaleY(0.25);
  transform-origin: 50% 0;
  background: linear-gradient(to bottom, transparent, #00e5ff, transparent);
  opacity: 0;
  transition:
    opacity 650ms var(--ease-out-quart),
    transform 900ms var(--ease-out-quint);
}

.is-active .starfield span {
  opacity: 0.72;
  transform:
    rotate(calc(var(--i) * 8.57deg))
    translateY(clamp(7rem, 28vw, 26rem))
    scaleY(1);
}

.starfield span:nth-child(3n) {
  background: linear-gradient(to bottom, transparent, #3b6bff, transparent);
}

.starfield span:nth-child(4n) {
  background: linear-gradient(to bottom, transparent, #8b3bff, transparent);
}

.ending-inner {
  display: grid;
  place-content: center;
  text-align: center;
}

h1 {
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(2.4rem, 7vw, 7.5rem);
  line-height: 0.95;
  letter-spacing: 0;
  font-weight: 900;
}

h1 span {
  display: inline-block;
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 420ms var(--ease-out-quart),
    transform 520ms var(--ease-out-quint);
}

.is-active h1 span {
  opacity: 1;
  transform: translateY(0);
}

p {
  margin: 1.5rem 0 0;
  color: var(--label-2);
  font-size: clamp(1rem, 1.5vw, 1.25rem);
}
</style>

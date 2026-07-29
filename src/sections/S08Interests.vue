<script setup>
import FallingIcons from '@/components/FallingIcons.vue'
import { interests } from '@/data/interests'

defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="interests-section" :class="{ 'is-active': active }">
    <FallingIcons variant="interests" />
    <div class="section-inner interests-inner">
      <p class="section-kicker">OUTSIDE WORK</p>
      <div class="timeline mono">
        <span class="timeline-label start">EARLIER</span>
        <span class="timeline-label end">NOW</span>
        <div class="axis" />
        <article
          v-for="(item, index) in interests"
          :key="item.id"
          class="interest-item fade-up"
          :style="{ transitionDelay: `${index * 120}ms` }"
        >
          <div class="interest-image" :class="item.id" />
          <span class="dot" />
          <h2>{{ item.label }}</h2>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interests-section {
  position: relative;
  height: 100%;
  background: var(--bg-1);
}

.interests-inner {
  position: relative;
  z-index: 3;
  display: grid;
  align-content: center;
  gap: 4rem;
}

.timeline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  min-height: 54dvh;
  align-items: center;
}

.axis {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--line);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 900ms var(--ease-out-quint);
}

.is-active .axis {
  transform: scaleX(1);
}

.timeline-label {
  position: absolute;
  top: calc(50% + 1.1rem);
  color: var(--label-3);
  font-size: var(--text-xs);
}

.timeline-label.start {
  left: 0;
}

.timeline-label.end {
  right: 0;
}

.interest-item {
  position: relative;
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 0.65rem;
  color: var(--label-2);
}

.interest-image {
  width: min(12vw, 9.5rem);
  min-width: 7rem;
  aspect-ratio: 1;
  border: 1px solid var(--line);
  filter: grayscale(1) brightness(0.72);
  transition: filter 500ms var(--ease-out-quart), transform 500ms var(--ease-out-quint);
}

.interest-item:hover .interest-image {
  filter: grayscale(0) brightness(1);
  transform: scale(1.04);
}

.interest-image.water-sports {
  background: linear-gradient(140deg, #061a2b, #2b83bf);
}

.interest-image.hiking {
  background: linear-gradient(140deg, #1a241c, #7fa35b);
}

.interest-image.diving {
  background: linear-gradient(140deg, #02131a, #00a8c8);
}

.interest-image.staghorn-fern {
  background: linear-gradient(140deg, #172016, #7da34d);
}

.interest-image.fishing {
  background: linear-gradient(140deg, #15181c, #5e8ba8);
}

.dot {
  position: relative;
  z-index: 2;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--label-2);
  transition:
    background var(--dur-hover),
    transform var(--dur-hover);
}

.interest-item:hover .dot {
  background: var(--accent);
  transform: scale(1.7);
}

h2 {
  margin: 0;
  color: var(--label-1);
  font-size: var(--text-sm);
}

p {
  margin: 0;
  max-width: 12rem;
  font-family: var(--font-zh);
  font-size: var(--text-sm);
  line-height: 1.65;
}

@media (max-width: 767px) {
  .timeline {
    grid-template-columns: 1fr;
    min-height: auto;
    align-items: start;
    gap: 1.25rem;
  }

  .axis,
  .timeline-label {
    display: none;
  }

  .interest-item {
    grid-template-columns: 5rem 0.75rem 1fr;
    justify-items: start;
    text-align: left;
  }

  .interest-image {
    width: 5rem;
    min-width: 5rem;
    grid-row: span 2;
  }
}
</style>

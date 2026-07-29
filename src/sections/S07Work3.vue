<script setup>
import FallingIcons from '@/components/FallingIcons.vue'
import WorkCard from '@/components/WorkCard.vue'
import { works } from '@/data/works'

defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})

const pageWorks = works.slice(5)
</script>

<template>
  <div class="work-section" :class="{ 'is-active': active }">
    <FallingIcons variant="work" />
    <div class="section-inner work-grid-inner haoqi-grid">
      <p class="section-kicker work-title">WORK 03 - WEB / EC / APP</p>
      <div class="work-grid third-grid">
        <div
          v-for="(work, index) in pageWorks"
          :key="work.id"
          class="fade-up"
          :style="{ transitionDelay: `${index * 70}ms` }"
        >
          <WorkCard :work="work" :active="active" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-section {
  position: relative;
  height: 100%;
  background: var(--bg-1);
}

.work-grid-inner {
  position: relative;
  z-index: 3;
  overflow: hidden;
}

.work-grid {
  grid-column: 5 / span 8;
  grid-row: 1 / span 5;
  align-self: start;
  margin-top: -3.85rem;
  display: grid;
  gap: clamp(0.75rem, 1.4vw, 1.2rem);
}

.third-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.work-title {
  grid-column: 1 / span 3;
  grid-row: 1;
  align-self: end;
}

@media (max-width: 1100px) {
  .third-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .third-grid {
    grid-template-columns: 1fr;
  }
}
</style>

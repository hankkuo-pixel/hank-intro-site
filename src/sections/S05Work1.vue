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

const heroWork = works[0]
</script>

<template>
  <div class="work-section" :class="{ 'is-active': active }">
    <FallingIcons variant="work" />
    <div class="section-inner work-one-inner haoqi-grid">
      <p class="section-kicker work-title">SELECTED WORK - 11 PROJECTS</p>
      <div class="work-reveal primary-card fade-up">
        <WorkCard :work="heroWork" :active="active" large />
      </div>
      <div class="work-reveal lower-card-a fade-up" style="transition-delay: 140ms">
        <WorkCard :work="works[1]" :active="active" />
      </div>
      <div class="work-reveal lower-card-b fade-up" style="transition-delay: 220ms">
        <WorkCard :work="works[4]" :active="active" />
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

.work-one-inner {
  position: relative;
  z-index: 3;
  overflow: hidden;
}

.work-title {
  grid-column: 1 / span 3;
  grid-row: 1;
  align-self: end;
}

.primary-card {
  grid-column: 5 / span 8;
  grid-row: 1 / span 4;
  align-self: start;
  margin-top: -3.85rem;
}

.lower-card-a {
  grid-column: 1 / span 5;
  grid-row: 6 / span 1;
  align-self: start;
  transform: translateY(24%);
}

.lower-card-b {
  grid-column: 7 / span 5;
  grid-row: 6 / span 1;
  align-self: start;
  transform: translateY(24%);
}

.is-active .lower-card-a,
.is-active .lower-card-b {
  transform: translateY(0);
}
</style>

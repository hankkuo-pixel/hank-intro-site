<script setup>
import { experiences } from '@/data/experiences'

defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="experience-section" :class="{ 'is-active': active }">
    <div class="section-inner experience-inner">
      <p class="section-kicker">EXPERIENCE - 8 YEARS</p>
      <div class="experience-list">
        <article
          v-for="(item, index) in experiences"
          :key="item.id"
          class="experience-row fade-up"
          :style="{ transitionDelay: `${index * 80}ms` }"
        >
          <div class="row-main mono">
            <span>{{ item.range }}</span>
            <span>{{ item.company }}</span>
            <span>{{ item.role }}</span>
          </div>
          <ul>
            <li v-for="point in item.points" :key="point">{{ point }}</li>
          </ul>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.experience-section {
  height: 100%;
  background: var(--bg-1);
}

.experience-inner {
  display: grid;
  align-content: center;
  gap: 2rem;
}

.experience-list {
  border-top: 1px solid var(--line);
}

.experience-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.7fr);
  gap: 2rem;
  min-height: 12dvh;
  align-items: center;
  border-bottom: 1px solid var(--line);
  color: var(--label-3);
  transition:
    background var(--dur-hover),
    color var(--dur-hover),
    min-height var(--dur-hover),
    opacity var(--dur-enter) var(--ease-out-quart),
    transform var(--dur-enter) var(--ease-out-quint);
}

.experience-row:hover {
  min-height: calc(12dvh + 8px);
  background: var(--accent);
  color: #080909;
}

.row-main {
  display: grid;
  grid-template-columns: 0.55fr 1fr 1fr;
  gap: 1rem;
  padding: 0 1rem;
  font-size: clamp(0.78rem, 1.25vw, 1rem);
  text-transform: uppercase;
}

ul {
  margin: 0;
  padding: 1rem 1.2rem 1rem 0;
  list-style: none;
  opacity: 0;
  transform: translateX(24px);
  transition:
    opacity var(--dur-hover),
    transform var(--dur-hover);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: 1.8;
}

.experience-row:hover ul {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .experience-row {
    grid-template-columns: 1fr;
    gap: 0;
    min-height: auto;
    padding: 1rem 0;
    color: var(--label-2);
  }

  .row-main {
    grid-template-columns: 1fr;
  }

  ul {
    opacity: 1;
    transform: none;
    padding: 1rem;
  }
}
</style>

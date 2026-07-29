<script setup>
import ScrambleText from '@/components/ScrambleText.vue'

defineProps({
  work: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  large: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <article class="work-card" :class="{ large }">
    <div class="work-image">
      <img :src="work.cover" :alt="work.title" />
      <span class="work-tag mono">{{ work.tag }}</span>
    </div>
    <div class="work-meta mono">
      <ScrambleText :text="work.title" :active="active" :delay="180" />
      <span class="rule" />
      <span>{{ work.year }} {{ work.type }}↗</span>
    </div>
    <p v-if="large" class="work-desc">{{ work.subtitle }}</p>
  </article>
</template>

<style scoped>
.work-card {
  min-width: 0;
}

.work-image {
  position: relative;
  aspect-ratio: 1 / 0.72;
  overflow: hidden;
  background: #0f1013;
  border: 1px solid var(--line);
}

.large .work-image {
  aspect-ratio: 16 / 7.2;
  transform: none;
  transform-origin: center;
}

.work-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  filter: grayscale(1) brightness(0.75);
  transition:
    filter 600ms var(--ease-out-quart),
    transform 600ms var(--ease-out-quint);
}

.work-card:hover img {
  filter: grayscale(0) brightness(1);
  transform: scale(1.035);
}

.work-tag {
  position: absolute;
  right: 0;
  bottom: 0;
  background: var(--accent);
  color: #070808;
  padding: 0.28rem 0.45rem;
  font-size: 0.65rem;
}

.work-meta {
  display: flex;
  align-items: center;
  min-height: 2.25rem;
  gap: 0.7rem;
  color: var(--label-1);
  font-size: 0.68rem;
  white-space: nowrap;
}

.rule {
  height: 1px;
  flex: 1;
  min-width: 1.5rem;
  background: var(--line);
}

.work-desc {
  max-width: 48rem;
  margin: 0.35rem 0 0;
  color: var(--label-2);
  font-size: var(--text-sm);
  line-height: 1.55;
}

@media (hover: none) {
  .work-image img {
    filter: grayscale(0) brightness(1);
  }
}
</style>

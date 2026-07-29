<script setup>
import { computed, ref } from 'vue'
import TheCursor from '@/components/TheCursor.vue'
import TheGridOverlay from '@/components/TheGridOverlay.vue'
import TheNav from '@/components/TheNav.vue'
import ThePageIndicator from '@/components/ThePageIndicator.vue'
import { usePageScroll } from '@/composables/usePageScroll'
import S01Hero from '@/sections/S01Hero.vue'
import S02Statement from '@/sections/S02Statement.vue'
import S03About from '@/sections/S03About.vue'
import S04Experience from '@/sections/S04Experience.vue'
import S05Work1 from '@/sections/S05Work1.vue'
import S06Work2 from '@/sections/S06Work2.vue'
import S07Work3 from '@/sections/S07Work3.vue'
import S08Interests from '@/sections/S08Interests.vue'
import S09Ending from '@/sections/S09Ending.vue'

const sections = [
  { id: 'hero', component: S01Hero },
  { id: 'statement', component: S02Statement },
  { id: 'about', component: S03About },
  { id: 'experience', component: S04Experience },
  { id: 'work-1', component: S05Work1 },
  { id: 'work-2', component: S06Work2 },
  { id: 'work-3', component: S07Work3 },
  { id: 'interests', component: S08Interests },
  { id: 'ending', component: S09Ending },
]

const { currentIndex, goTo } = usePageScroll(sections)
const theme = ref('dark')

const appClasses = computed(() => ({
  'theme-light': theme.value === 'light',
}))

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <main class="app-shell" :class="appClasses">
    <TheGridOverlay />
    <TheCursor />
    <TheNav
      :current-index="currentIndex"
      :theme="theme"
      @go-to="goTo"
      @toggle-theme="toggleTheme"
    />
    <ThePageIndicator
      :sections="sections"
      :current-index="currentIndex"
      @go-to="goTo"
    />

    <div
      class="page-track"
      :style="{ '--index': currentIndex }"
      aria-live="polite"
    >
      <section
        v-for="(section, index) in sections"
        :key="section.id"
        class="snap-section"
        :id="section.id"
        :aria-hidden="currentIndex !== index"
      >
        <component
          :is="section.component"
          :active="currentIndex === index"
          @go-to="goTo"
        />
      </section>
    </div>
  </main>
</template>

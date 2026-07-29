<script setup>
import ScrambleText from '@/components/ScrambleText.vue'

defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="statement-section" :class="{ 'is-active': active }">
    <div class="section-inner statement-inner">
      <p class="section-kicker">STATEMENT</p>
      <h1 class="statement-title">
        <span><ScrambleText text="I TURN COMPLEXITY" :active="active" /></span>
        <span>
          <ScrambleText text="INTO" :active="active" :delay="130" />
          <em><ScrambleText text="CLEAR" :active="active" :delay="220" /></em>
        </span>
        <span><ScrambleText text="EXPERIENCE" :active="active" :delay="330" /></span>
      </h1>
      <p class="statement-copy mono fade-up" style="transition-delay: 420ms">
        把千萬人每天在用的複雜系統，變成一次就會用的介面。
      </p>
    </div>
  </div>
</template>

<style scoped>
.statement-section {
  height: 100%;
  background: var(--bg-1);
}

.statement-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.statement-title {
  margin: 2rem 0 0;
  font-family: var(--font-sans);
  font-size: var(--text-hero);
  font-weight: 900;
  line-height: 0.92;
  letter-spacing: 0;
  text-transform: uppercase;
}

.statement-title span {
  display: block;
}

.statement-title em {
  color: var(--accent);
  font-style: normal;
}

.statement-copy {
  margin: 2.2rem 0 0;
  color: var(--label-2);
  font-size: var(--text-sm);
}
</style>

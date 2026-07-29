<script setup>
import FallingIcons from '@/components/FallingIcons.vue'

defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="hero-section" :class="{ 'is-active': active }">
    <div class="section-inner hero-inner haoqi-grid">
      <div class="hero-brand-copy">
        <span class="mask-line"><span>Design &</span></span>
        <span class="mask-line"><span>AI Workflow</span></span>
      </div>

      <p class="hero-note mono fade-up" style="transition-delay: 160ms">
        Thinking in systems.<br />
        Designing with care.
      </p>

      <p class="hero-intro mono fade-up" style="transition-delay: 220ms">
        我是郭翰廷，EY 資深體驗設計顧問，正在把 AI 變成設計流程的一部分。工作裡，我用系統思考設計，也用數據證明價值。
      </p>

      <h1 class="hero-statement" aria-label="I bring craft and taste to digital work">
        <span class="mask-line"><span>I BRING</span></span>
        <span class="mask-line"><span>CRAFT &amp; TASTE</span></span>
        <span class="mask-line"><span>TO DIGITAL WORK</span></span>
      </h1>

      <div class="hero-hello" aria-hidden="true">
        <img :src="'./images/hero-hello.png'" alt="" />
      </div>

      <img class="hero-arrow" :src="'./images/cursor-arrow.png'" alt="" aria-hidden="true" />

      <FallingIcons variant="hero" />
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  height: 100%;
  background:
    radial-gradient(circle at 63% 24%, rgba(24, 91, 255, 0.42), transparent 34%),
    radial-gradient(circle at 45% 64%, rgba(48, 105, 255, 0.33), transparent 35%),
    linear-gradient(112deg, rgba(255, 255, 255, 0.08), transparent 32%),
    #071759;
}

.hero-inner {
  overflow: hidden;
}

.hero-brand-copy {
  grid-column: 1 / span 3;
  grid-row: 1 / span 2;
  align-self: start;
  padding-top: 2.35rem;
  font-family: var(--font-sans);
  font-size: clamp(1.65rem, 1.95vw, 2rem);
  font-weight: 650;
  line-height: 1.12;
  letter-spacing: 0;
}

.hero-brand-copy .mask-line:nth-child(2) span {
  transition-delay: 90ms;
}

.hero-note {
  grid-column: 5 / span 2;
  grid-row: 1 / span 1;
  align-self: center;
  margin: 0;
  color: var(--label-1);
  line-height: 1.45;
  font-size: 0.78rem;
}

.hero-intro {
  grid-column: 9 / span 4;
  grid-row: 1 / span 1;
  align-self: center;
  max-width: 34rem;
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.55;
}

.hero-statement {
  grid-column: 1 / span 7;
  grid-row: 4 / span 2;
  align-self: end;
  position: relative;
  z-index: 4;
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(3.25rem, 6.85vw, 7.65rem);
  font-weight: 900;
  line-height: 0.98;
  letter-spacing: 0;
  color: #fff;
}

.hero-statement .mask-line:nth-child(2) span {
  transition-delay: 110ms;
}

.hero-statement .mask-line:nth-child(3) span {
  transition-delay: 220ms;
}

.hero-hello {
  position: absolute;
  z-index: 3;
  left: 23.5%;
  top: 25.5%;
  width: min(55vw, 58rem);
  opacity: 0;
  transform: translateY(24px) rotate(-1deg) scale(0.97);
  transition:
    opacity 900ms var(--ease-out-quart) 180ms,
    transform 900ms var(--ease-out-quint);
}

.hero-hello img {
  width: 100%;
  height: auto;
  display: block;
  filter:
    drop-shadow(0 28px 38px rgba(0, 0, 0, 0.3))
    drop-shadow(0 0 42px rgba(71, 135, 255, 0.26));
}

.is-active .hero-hello {
  opacity: 1;
  transform: translateY(0) rotate(-1deg) scale(1);
}

.hero-arrow {
  position: absolute;
  z-index: 4;
  right: 9.4vw;
  bottom: 11.4dvh;
  width: clamp(5.75rem, 8.4vw, 8.4rem);
  height: clamp(6.25rem, 9.4vw, 9.8rem);
  object-fit: contain;
  filter: drop-shadow(0 26px 42px rgba(0, 0, 0, 0.35));
  opacity: 0;
  transform: translateY(40px) rotate(-14deg);
  transition:
    opacity 700ms var(--ease-out-quart) 380ms,
    transform 900ms var(--ease-out-quint) 380ms;
}

.is-active .hero-arrow {
  opacity: 1;
  transform: translateY(0) rotate(-14deg);
}

@media (max-width: 900px) {
  .hero-inner {
    display: block;
  }

  .hero-brand-copy {
    padding-top: 6dvh;
  }

  .hero-statement {
    position: absolute;
    left: 1rem;
    right: 1rem;
    bottom: 12dvh;
    font-size: clamp(2.75rem, 14vw, 5.8rem);
  }

  .hero-hello {
    left: -4vw;
    top: 30dvh;
    width: 106vw;
  }

  .hero-note {
    margin-top: 2rem;
  }

  .hero-intro {
    margin-top: 1.5rem;
    max-width: 24rem;
  }
}
</style>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="about-section" :class="{ 'is-active': active }">
    <div class="section-inner about-inner">
      <figure class="portrait fade-up">
        <img :src="'./uploads/avatar_29d8161807.png'" alt="Hank Kuo portrait" />
      </figure>
      <div class="about-copy">
        <p class="lead fade-up" style="transition-delay: 120ms">
          我做設計 8 年，現在在 EY 安永擔任資深體驗設計顧問。工作是把複雜的商業需求，變成一看就懂的數位體驗，從問題定義一路做到介面交付。
        </p>
        <p class="lead muted fade-up" style="transition-delay: 240ms">
          經手過 <button type="button">麥當勞</button>、<button type="button">全家便利商店</button>、<button type="button">南山人壽</button>、<button type="button">美廉社</button>。現在正在把 <button type="button">Claude Code</button> 和 <button type="button">Gemini CLI</button> 變成一條從研究、設計到前端的完整生產線。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-section {
  height: 100%;
  background: var(--bg-1);
}

.about-inner {
  display: grid;
  grid-template-columns: minmax(16rem, 0.8fr) 1.7fr;
  gap: clamp(2rem, 5vw, 6rem);
  align-items: center;
}

.portrait {
  margin: 0;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--bg-elevated);
  border: 1px solid var(--line);
}

.portrait img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  filter: grayscale(1) contrast(1.08) brightness(0.78);
}

.about-copy {
  display: grid;
  gap: 2rem;
}

.lead {
  margin: 0;
  font-size: var(--text-lead);
  line-height: 1.42;
  letter-spacing: 0;
}

.muted {
  color: var(--label-2);
}

.lead button {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition: color var(--dur-hover);
}

.lead button:hover {
  color: var(--accent);
}

@media (max-width: 900px) {
  .about-inner {
    grid-template-columns: 1fr;
    align-content: center;
  }

  .portrait {
    width: min(45vw, 16rem);
  }
}
</style>

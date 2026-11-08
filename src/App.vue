<script setup>
import { ref } from 'vue'
import Wheel from './components/Wheel.vue'
import QuizView from './components/QuizView.vue'
import { partners } from './partners.js'
import suseLogo from '../assets/suse-logo.svg'

const selected = ref(null)
</script>

<template>
  <div class="stage">
    <header class="top">
      <img :src="suseLogo" alt="SUSE" class="suse" />
      <h1>Partner Wheel of Fortune</h1>
    </header>

    <main>
      <QuizView
        v-if="selected"
        :key="selected.id"
        :partner="selected"
        @reset="selected = null"
      />
      <Wheel v-else :partners="partners" @landed="(p) => (selected = p)" />
    </main>
  </div>
</template>

<style scoped>
.top { display: flex; align-items: center; gap: 2cqw; height: 10cqh; flex: none; }
.suse { height: 5cqh; }
h1 { margin: 0; font-size: 3cqh; font-weight: 700; letter-spacing: 0.01em; }
main { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; padding-bottom: 2cqh; }
</style>

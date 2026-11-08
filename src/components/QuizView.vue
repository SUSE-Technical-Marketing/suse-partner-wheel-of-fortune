<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  partner: { type: Object, required: true },
})
const emit = defineEmits(['reset'])

const revealed = ref(false)
const hasQuestions = computed(() => props.partner.questions.length > 0)
const letter = (i) => String.fromCharCode(65 + i)
const isCorrect = (q, i) => letter(i) === q.answer.toUpperCase()
</script>

<template>
  <section class="quiz">
    <aside class="side">
      <div class="logo-card">
        <img
          :src="partner.logo"
          :alt="partner.name"
          :class="{ 'tint-dark': partner.tint === 'dark' }"
        />
      </div>
      <h2>{{ partner.name }}</h2>
      <p v-if="!hasQuestions" class="no-questions">No questions for this partner. Spin again!</p>
      <button v-if="hasQuestions && !revealed" class="btn btn--big" @click="revealed = true">Answer</button>
      <button v-else class="btn btn--big" @click="emit('reset')">Reset</button>
    </aside>

    <ol v-if="hasQuestions" class="questions">
      <li v-for="(q, qi) in partner.questions" :key="qi" class="q-box">
        <div class="q-text"><span class="q-num">{{ qi + 1 }}</span>{{ q.question }}</div>

        <ul v-if="q.options" class="options">
          <li
            v-for="(opt, oi) in q.options"
            :key="oi"
            class="option"
            :class="revealed ? (isCorrect(q, oi) ? 'is-correct' : 'is-wrong') : ''"
          >
            <span class="mark" aria-hidden="true">
              <template v-if="revealed">{{ isCorrect(q, oi) ? '✓' : '✗' }}</template>
              <template v-else>{{ letter(oi) }}</template>
            </span>
            <span class="opt-text">{{ opt }}</span>
            <span v-if="revealed" class="sr-only">{{ isCorrect(q, oi) ? '(correct)' : '(wrong)' }}</span>
          </li>
        </ul>

        <div v-else class="option open-answer" :class="revealed ? 'is-correct' : 'is-hidden'">
          <template v-if="revealed">
            <span class="mark" aria-hidden="true">✓</span>
            <span class="opt-text">{{ q.answer }}</span>
          </template>
          <span v-else class="opt-text">Answer hidden</span>
        </div>

        <p v-if="revealed && q.explanation" class="explanation">{{ q.explanation }}</p>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.quiz {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 27cqw 1fr;
  gap: 2.5cqw;
  animation: pop 0.45s ease both;
}
@keyframes pop { from { opacity: 0; transform: scale(0.97); } }

.side { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3cqh; text-align: center; }
.side h2 { margin: 0; font-size: 3.4cqh; color: var(--mint); }
.logo-card {
  width: 100%;
  background: #fff;
  border-radius: 3cqh;
  padding: 3cqh 2cqw;
  box-shadow: 0 1.5cqh 4cqh rgba(0, 0, 0, 0.4);
  border-bottom: 1cqh solid var(--jungle);
}
.logo-card img { display: block; width: 100%; height: 20cqh; object-fit: contain; }
.tint-dark { filter: brightness(0); }
.no-questions { margin: 0; font-size: 2.6cqh; color: var(--fog); }

.questions {
  list-style: none; margin: 0; padding: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 1.6cqh;
}
.q-box {
  min-height: 0;
  display: flex; flex-direction: column; justify-content: center; gap: 0.8cqh;
  background: #0f4a40;
  border: 0.3cqh solid rgba(144, 235, 205, 0.35);
  border-radius: 2cqh;
  padding: 1.6cqh 1.6cqw;
  box-shadow: 0 1cqh 3cqh rgba(0, 0, 0, 0.3);
}
.q-text { display: flex; align-items: center; gap: 1cqw; font-size: 2.6cqh; font-weight: 700; line-height: 1.2; }
.q-num {
  flex: none;
  width: 4cqh; height: 4cqh;
  display: grid; place-items: center;
  border-radius: 50%;
  background: var(--jungle); color: #fff;
  font-size: 2.2cqh;
}

.options { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5cqh; }
.option {
  display: flex; align-items: center; gap: 1cqw;
  padding: 0.35cqh 1cqw;
  border-radius: 1.2cqh;
  border: 0.3cqh solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.07);
  font-size: 2.1cqh;
  line-height: 1.2;
  transition: background 0.3s, border-color 0.3s;
}
.mark {
  flex: none;
  width: 3cqh; height: 3cqh;
  display: grid; place-items: center;
  border-radius: 50%;
  font-weight: 800; font-size: 1.8cqh;
  background: transparent; border: 0.25cqh solid rgba(255, 255, 255, 0.5); color: #fff;
}
.is-correct { border-color: var(--jungle); background: rgba(48, 186, 120, 0.3); }
.is-correct .mark { background: var(--jungle); border-color: var(--jungle); }
.is-wrong { border-color: var(--persimmon); background: rgba(254, 124, 63, 0.22); }
.is-wrong .mark { background: var(--persimmon); border-color: var(--persimmon); }
.is-wrong .opt-text { text-decoration: line-through; text-decoration-color: rgba(254, 124, 63, 0.8); }
.is-hidden { border-style: dashed; color: rgba(255, 255, 255, 0.6); font-style: italic; }

.explanation { margin: 0; padding-left: 1cqw; border-left: 0.5cqh solid var(--jungle); font-size: 1.7cqh; color: var(--fog); line-height: 1.3; }

.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>

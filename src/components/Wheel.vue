<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  partners: { type: Array, required: true },
})
const emit = defineEmits(['landed'])

const R = 480 // wheel radius in SVG units
const palette = ['#192072', '#2453ff', '#0c322c', '#1f8a57']

const count = computed(() => props.partners.length)
const sliceAngle = computed(() => 360 / count.value)

const rotation = ref(0) // degrees, clockwise
const spinning = ref(false)
const winnerId = ref(null)
const kick = ref(0) // pointer flick, 0..1

const point = (deg, r) => {
  const a = (deg * Math.PI) / 180
  return [r * Math.sin(a), -r * Math.cos(a)]
}

const slices = computed(() =>
  props.partners.map((partner, i) => {
    const a0 = i * sliceAngle.value
    const a1 = (i + 1) * sliceAngle.value
    const [x0, y0] = point(a0, R)
    const [x1, y1] = point(a1, R)
    let colorIdx = i % palette.length
    // avoid the last slice matching the first when count isn't a multiple of 4
    if (i === count.value - 1 && colorIdx === 0) colorIdx = 2
    return {
      partner,
      path: `M0 0 L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`,
      fill: palette[colorIdx],
      mid: a0 + sliceAngle.value / 2,
    }
  }),
)

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)
let raf = 0

const sliceUnderPointer = (rot) => {
  const theta = (((-rot) % 360) + 360) % 360
  return Math.floor(theta / sliceAngle.value) % count.value
}

function spin() {
  if (spinning.value || !count.value) return
  winnerId.value = null
  spinning.value = true

  // Pick the winner up front; the animation is then arranged to land on it.
  const target = Math.floor(Math.random() * count.value)
  const jitter = (Math.random() - 0.5) * sliceAngle.value * 0.7
  const desired = -(target + 0.5) * sliceAngle.value + jitter
  const start = rotation.value
  const delta = ((((desired - start) % 360) + 360) % 360)
  const turns = 6 + Math.floor(Math.random() * 3)
  const total = turns * 360 + delta
  const duration = 7000 + Math.random() * 2000

  const t0 = performance.now()
  let lastIdx = sliceUnderPointer(start)

  const frame = (now) => {
    const t = Math.min((now - t0) / duration, 1)
    rotation.value = start + total * easeOutQuart(t)

    const idx = sliceUnderPointer(rotation.value)
    if (idx !== lastIdx) {
      lastIdx = idx
      kick.value = 1
    }
    kick.value = Math.max(0, kick.value - 0.09)

    if (t < 1) {
      raf = requestAnimationFrame(frame)
    } else {
      kick.value = 0
      spinning.value = false
      winnerId.value = props.partners[target].id
      // let the highlight sink in before switching to the quiz
      setTimeout(() => emit('landed', props.partners[target]), 1400)
    }
  }
  raf = requestAnimationFrame(frame)
}

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <section class="wheel-view">
    <div class="wheel-wrap">
      <svg class="wheel" viewBox="-520 -560 1040 1080" role="img" aria-label="Partner wheel of fortune">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity="0.45" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          <circle :r="R + 26" fill="#fff" />
          <circle :r="R + 14" fill="#30ba78" />
        </g>

        <g :style="{ transform: `rotate(${rotation}deg)` }" class="spinner">
          <g v-for="s in slices" :key="s.partner.id">
            <path
              :d="s.path"
              :fill="s.fill"
              stroke="#fff"
              stroke-width="4"
              :class="{ winner: winnerId === s.partner.id, dim: winnerId !== null && winnerId !== s.partner.id }"
            />
            <g :transform="`rotate(${s.mid})`" :class="{ dim: winnerId !== null && winnerId !== s.partner.id }">
              <rect x="-45" y="-425" width="90" height="220" rx="16" fill="#fff" />
              <g :transform="`translate(0 -315) rotate(${s.mid > 180 ? 90 : -90})`">
                <image
                  :href="s.partner.logo"
                  x="-100"
                  y="-34"
                  width="200"
                  height="68"
                  preserveAspectRatio="xMidYMid meet"
                  :class="{ 'tint-dark': s.partner.tint === 'dark' }"
                >
                  <title>{{ s.partner.name }}</title>
                </image>
              </g>
            </g>
          </g>
        </g>

        <!-- hub -->
        <circle r="92" fill="#0c322c" stroke="#fff" stroke-width="10" />
        <circle r="34" fill="#30ba78" />

        <!-- pointer -->
        <g :style="{ transform: `translate(0px, -${R + 22}px) rotate(${-kick * 22}deg)` }" class="pointer">
          <path d="M-34 -40 L34 -40 L0 54 Z" fill="#fe7c3f" stroke="#fff" stroke-width="8" stroke-linejoin="round" />
        </g>
      </svg>
    </div>

    <button class="btn btn--big" :disabled="spinning" @click="spin">Spin!</button>
  </section>
</template>

<style scoped>
.wheel-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5cqw;
}
.wheel-wrap {
  flex: none;
  width: 85cqh;
}
.wheel { width: 100%; height: auto; display: block; overflow: visible; }
.spinner { transform-origin: 0 0; will-change: transform; }
.pointer { transform-origin: 0 0; transform-box: view-box; }
.tint-dark { filter: brightness(0); }
.dim { opacity: 0.45; transition: opacity 0.4s; }
.winner { filter: brightness(1.25); stroke: #fe7c3f; stroke-width: 10; }
.btn--big { font-size: 7cqh; }
</style>

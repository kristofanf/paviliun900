<script setup>
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import { imgUrl } from '@/utils/property'
const props = defineProps({ photos: { type: Array, required: true }, initialIndex: { type: Number, default: 0 }, unitName: { type: String, default: '' } })
const emit = defineEmits(['close'])
const dialog = useTemplateRef('dialog')
const index = shallowRef(props.initialIndex)
const currentPhoto = computed(() => props.photos[index.value])
let unmounting = false
function step(direction) { index.value = (index.value + direction + props.photos.length) % props.photos.length }
function keydown(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    step(event.key === 'ArrowRight' ? 1 : -1)
  }
}
function close() { dialog.value?.close() }
function closed() { if (!unmounting) emit('close') }
onMounted(() => dialog.value.showModal())
onBeforeUnmount(() => { unmounting = true; if (dialog.value?.open) dialog.value.close() })
</script>

<template>
  <dialog ref="dialog" class="overlay" aria-label="Photo viewer" @keydown="keydown" @close="closed" @click="event => { if (event.target === event.currentTarget) close() }">
    <div class="viewer-content">
      <div class="viewer-toolbar"><p aria-live="polite" aria-atomic="true">{{ index + 1 }} / {{ photos.length }}</p><button class="viewer-close" autofocus @click="close"><span class="mdi mdi-close" aria-hidden="true" /> Close</button></div>
      <div class="viewer-stage">
        <button v-if="photos.length > 1" class="viewer-arrow previous" aria-label="Previous photo" @click="step(-1)"><span class="mdi mdi-chevron-left" aria-hidden="true" /></button>
        <img v-if="currentPhoto" class="lightbox-img" :src="imgUrl(currentPhoto)" :alt="`${unitName} — photo ${index + 1}`" />
        <button v-if="photos.length > 1" class="viewer-arrow next" aria-label="Next photo" @click="step(1)"><span class="mdi mdi-chevron-right" aria-hidden="true" /></button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; margin: auto; width: min(1400px, 96vw); max-width: 96vw; height: min(920px, 94svh); max-height: 94svh; padding: 20px; border: 0; background: #181818; color: white; border-radius: 4px; }
.overlay:modal { overscroll-behavior: contain; }
.overlay::backdrop { background: rgb(0 0 0 / .87); overflow: hidden; overscroll-behavior: contain; }
.overlay[open] { animation: viewer-arrive .22s ease-out; }
.viewer-content { height: 100%; display: flex; flex-direction: column; }
.viewer-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 20px; min-height: 48px; padding-bottom: 16px; }
.viewer-toolbar p { font-variant-numeric: tabular-nums; margin: 0; }
.viewer-close, .viewer-arrow { background: #292929; border: 1px solid #747474; color: white; border-radius: 4px; cursor: pointer; min-width: 46px; min-height: 46px; }
.viewer-close { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; }
.viewer-stage { display: grid; grid-template-columns: 48px minmax(0, 1fr) 48px; align-items: center; gap: 18px; min-height: 0; flex: 1; }
.lightbox-img { width: 100%; height: 100%; min-height: 0; object-fit: contain; grid-column: 2; grid-row: 1; }
.viewer-arrow { font-size: 28px; }
.previous { grid-column: 1; grid-row: 1; }
.next { grid-column: 3; grid-row: 1; }
@keyframes viewer-arrive { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 600px) {
  .overlay { padding: 14px; width: 100vw; max-width: 100vw; height: 100svh; max-height: 100svh; border-radius: 0; }
  .viewer-stage { grid-template-columns: 1fr 1fr; grid-template-rows: minmax(0, 1fr) 50px; gap: 20px; }
  .lightbox-img { grid-column: 1 / -1; grid-row: 1; }
  .previous { grid-column: 1; grid-row: 2; justify-self: start; }
  .next { grid-column: 2; grid-row: 2; justify-self: end; }
}
@media (prefers-reduced-motion: reduce) { .overlay[open] { animation: none; } }
</style>

<script setup>
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

defineProps({ tag: { type: String, default: 'div' } })
const element = useTemplateRef('element')
let observer
let animation

onMounted(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (media.matches || !('IntersectionObserver' in window)) return
  const stopOnPreference = () => { if (media.matches) { observer?.disconnect(); animation?.cancel() } }
  media.addEventListener('change', stopOnPreference)
  removePreferenceListener = () => media.removeEventListener('change', stopOnPreference)
  observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return
    animation = element.value?.animate(
      [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' },
    )
    observer.disconnect()
  }, { threshold: 0.08 })
  observer.observe(element.value)
})
let removePreferenceListener
onBeforeUnmount(() => { observer?.disconnect(); animation?.cancel(); removePreferenceListener?.() })
</script>

<template><component :is="tag" ref="element"><slot /></component></template>

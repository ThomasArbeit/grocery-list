<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

type Tab = {
  name: string
  label: string
}

const props = defineProps<{
  tabs: Tab[]
}>()

const currentTab = ref(props.tabs[0]?.name)
const previousTab = ref(currentTab.value)

const transitionName = computed(() => {
  const currentIndex = props.tabs.findIndex(t => t.name === currentTab.value)
  const prevIndex = props.tabs.findIndex(t => t.name === previousTab.value)
  return currentIndex > prevIndex ? 'slide-left' : 'slide-right'
})

function setTab(name: string) {
  if (name !== currentTab.value) {
    previousTab.value = currentTab.value
    currentTab.value = name
  }
}

// Refs for tab elements and slider
const tabRefs = ref<HTMLElement[]>([]);
const sliderStyle = ref({ left: '0px', width: '0px' })

function updateSlider() {
  nextTick(() => {
    const index = props.tabs.findIndex(t => t.name === currentTab.value)
    const tabEl = tabRefs.value[index]
    if (tabEl) {
      const rect = tabEl.getBoundingClientRect()
      sliderStyle.value = {
        left: `${tabEl.offsetLeft + 2}px`,
        width: `${rect.width - 4}px`,
      }
    }
  })
}

watch(currentTab, updateSlider)
onMounted(() => {
  nextTick(() => {
    updateSlider()

    // Optionnel : resize handler
    window.addEventListener('resize', updateSlider)

    // Swipe support
    let startX = 0
    window.addEventListener('touchstart', e => (startX = e.touches[0].clientX))
    window.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX
      const diff = endX - startX
      const currentIndex = props.tabs.findIndex(t => t.name === currentTab.value)

      if (diff > 50 && currentIndex > 0) {
        setTab(props.tabs[currentIndex - 1].name)
      } else if (diff < -50 && currentIndex < props.tabs.length - 1) {
        setTab(props.tabs[currentIndex + 1].name)
      }
    })
  })
})

function setTabRef(index: number, el: HTMLElement | null) {
  if (el) {
    tabRefs.value[index] = el
  }
}

</script>

<template>
  <div  class="relative w-full overflow-hidden">
    <!-- Tabs header -->
    <div class="relative flex justify-around rounded-xl bg-stone-200">
      <p
        v-for="(tab, i) in tabs"
        :key="tab.name"
        :ref="(el) => setTabRef(i, el as HTMLElement)"
        @click="setTab(tab.name)"
        :class="[
          'flex-1 px-4 py-2 text-center transition-colors relative z-10 font-semibold',
          currentTab === tab.name ? 'text-black font-bold' : 'text-stone-400'
        ]"
      >
        {{ tab.label }}
      </p>

      <!-- Animated slider -->
      <div
        class="absolute bottom-[2px] h-[36px] bg-white rounded-[10px] transition-all duration-300 z-0"
        :style="sliderStyle"
      />
    </div>

    <!-- Content with transition -->
    <Transition :name="transitionName" mode="out-in">
      <div :key="currentTab" class="py-6">
        <slot :name="currentTab" />
      </div>
    </Transition>
  </div>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

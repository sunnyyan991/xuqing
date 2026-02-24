<script setup>
import {onMounted, onUnmounted, ref, watch} from 'vue'
import {RouterLink, useRoute} from 'vue-router'
import {usePortfolio} from '@/composables/usePortfolio'

const route = useRoute()
const {navItems} = usePortfolio()

const isScrolled = ref(false)
const isDrawerOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const openDrawer = () => {
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeDrawer()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleEscape)
})

watch(
    () => route.fullPath,
    () => {
      closeDrawer()
    }
)
</script>

<template>
  <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      :class="[
      isScrolled
        ? 'bg-white/90 backdrop-blur-md py-5'
        : 'bg-transparent py-8'
    ]"
  >
    <nav class="content-container flex items-center justify-between">
      <RouterLink
          to="/"
          class="text-sm tracking-[0.15em] uppercase font-medium hover:opacity-60 transition-opacity duration-300"
          @click="closeDrawer"
      >
        Xuqing
      </RouterLink>

      <div class="flex items-center gap-4">
        <RouterLink
            to="/"
            class="nav-link"
            :class="{ 'active': route.path === '/' }"
            @click="closeDrawer"
        >
          Home
        </RouterLink>

        <button
            class="inline-flex items-center gap-2 px-3 py-2 text-xs tracking-[0.15em] uppercase border border-neutral-300 hover:border-neutral-500 hover:bg-white/70 transition-all duration-300"
            @click="openDrawer"
            aria-label="Open projects list"
        >
          Projects
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </nav>

    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="isDrawerOpen"
          class="fixed inset-0 z-40 bg-black/30"
          @click="closeDrawer"
      />
    </Transition>

    <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-250 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
    >
      <aside
          v-if="isDrawerOpen"
          class="fixed top-0 right-0 z-50 h-screen w-[86vw] max-w-[420px] bg-white border-l border-neutral-200 shadow-xl"
          role="dialog"
          aria-label="Project list"
      >
        <div class="h-full flex flex-col">
          <div class="flex items-center justify-between px-6 md:px-8 py-6 border-b border-neutral-200">
            <p class="text-xs tracking-[0.2em] uppercase text-secondary">Projects</p>
            <button
                class="p-2 -mr-2 hover:opacity-60 transition-opacity duration-300"
                @click="toggleDrawer"
                aria-label="Close projects list"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 md:px-8 py-8">
            <div class="flex flex-col gap-6">
              <RouterLink
                  to="/"
                  class="text-sm tracking-widest uppercase text-secondary hover:text-primary transition-colors duration-300"
                  :class="{ 'text-primary': route.path === '/' }"
                  @click="closeDrawer"
              >
                Home
              </RouterLink>

              <RouterLink
                  v-for="item in navItems"
                  :key="item.slug"
                  :to="`/work/${item.slug}`"
                  class="flex items-center gap-3 text-sm tracking-widest uppercase text-secondary hover:text-primary transition-colors duration-300"
                  :class="{ 'text-primary': route.params.slug === item.slug }"
                  @click="closeDrawer"
              >
                <span class="w-8 text-[11px] text-neutral-400 shrink-0">{{ item.order }}</span>
                <span>{{ item.name }}</span>
              </RouterLink>

              <div class="h-px bg-neutral-200 my-2" />

              <a
                  href="https://gu0za.itch.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center w-full px-4 py-3 text-sm tracking-wide border border-[#FA5C5C] text-[#FA5C5C] hover:bg-[#FA5C5C] hover:text-white transition-all duration-300"
                  @click="closeDrawer"
              >
                View My Projects on itch.io!
              </a>
            </div>
          </div>
        </div>
      </aside>
    </Transition>

  </header>
</template>

<script setup>
import {onMounted, onUnmounted, ref, watch} from 'vue'
import {RouterLink, useRoute} from 'vue-router'
import {usePortfolio} from '@/composables/usePortfolio'
import {useTheme} from '@/composables/useTheme'

const route = useRoute()
const {navItems} = usePortfolio()
const {isDark, toggleTheme} = useTheme()

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
        ? 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md py-5'
        : 'bg-transparent py-8'
    ]"
  >
    <nav class="content-container flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <div class="flex items-center gap-3 md:gap-6">
        <RouterLink
            to="/"
            class="text-sm tracking-[0.15em] uppercase font-medium hover:opacity-60 transition-opacity duration-300"
            @click="closeDrawer"
        >
          Xuqing
        </RouterLink>

        <a
            href="https://gu0za.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View my projects on itch.io (opens in a new tab)"
            class="inline-flex items-center gap-2 whitespace-nowrap px-3 py-2 text-xs tracking-wide border border-[#FA5C5C] text-[#FA5C5C] hover:bg-[#FA5C5C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FA5C5C] transition-colors duration-300"
        >
          itch.io
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17L17 7M7 7h10v10"/>
          </svg>
        </a>
      </div>

      <div class="ml-auto flex items-center gap-2 sm:gap-4">
        <RouterLink
            to="/"
            class="nav-link"
            :class="{ 'active': route.path === '/' }"
            @click="closeDrawer"
        >
          Home
        </RouterLink>

        <button
            type="button"
            @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-pressed="isDark"
            class="inline-flex items-center justify-center w-9 h-9 shrink-0 border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current transition-colors duration-300"
        >
          <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" stroke-width="1.5"/>
            <path stroke-linecap="round" stroke-width="1.5" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.9 13.1A9 9 0 0 1 10.9 3.1a9 9 0 1 0 10 10Z"/>
          </svg>
        </button>

        <button
            class="inline-flex items-center gap-2 px-3 py-2 text-xs tracking-[0.15em] uppercase border border-neutral-300 hover:border-neutral-500 hover:bg-white/70 dark:border-neutral-700 dark:hover:border-neutral-500 dark:hover:bg-neutral-800/70 transition-all duration-300"
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
          class="fixed inset-0 z-40 bg-black/30 dark:bg-black/60"
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
          class="fixed top-0 right-0 z-50 h-screen w-[86vw] max-w-[420px] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-xl"
          role="dialog"
          aria-label="Project list"
      >
        <div class="h-full flex flex-col">
          <div class="flex items-center justify-between px-6 md:px-8 py-6 border-b border-neutral-200 dark:border-neutral-800">
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

              <div class="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />

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

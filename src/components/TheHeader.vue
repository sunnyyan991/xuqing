<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import {RouterLink, useRoute} from 'vue-router'
import {usePortfolio} from '@/composables/usePortfolio'

const route = useRoute()
const {navItems} = usePortfolio()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
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
      <!-- Logo / Home -->
      <RouterLink
          to="/"
          class="text-sm tracking-[0.15em] uppercase font-medium hover:opacity-60 transition-opacity duration-300"
          @click="closeMobileMenu"
      >
        Xuqing
      </RouterLink>

      <!-- Desktop Navigation - 顯示名稱而不是數字 -->
      <div class="hidden md:flex items-center gap-10">
        <RouterLink
            to="/"
            class="nav-link"
            :class="{ 'active': route.path === '/' }"
        >
          Home
        </RouterLink>

        <RouterLink
            v-for="item in navItems"
            :key="item.slug"
            :to="`/work/${item.slug}`"
            class="nav-link"
            :class="{ 'active': route.params.slug === item.slug }"
        >
          {{ item.name }}
        </RouterLink>
      </div>

      <!-- Mobile Menu Button -->
      <button
          class="md:hidden p-2 -mr-2 hover:opacity-60 transition-opacity duration-300"
          @click="toggleMobileMenu"
          aria-label="Toggle menu"
      >
        <svg
            v-if="!isMobileMenuOpen"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
    >
      <div
          v-if="isMobileMenuOpen"
          class="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-100"
      >
        <div class="content-container py-8 flex flex-col gap-6">
          <RouterLink
              to="/"
              class="text-sm tracking-widest uppercase text-secondary hover:text-primary transition-colors duration-300"
              @click="closeMobileMenu"
          >
            Home
          </RouterLink>

          <RouterLink
              v-for="item in navItems"
              :key="item.slug"
              :to="`/work/${item.slug}`"
              class="text-sm tracking-widest uppercase text-secondary hover:text-primary transition-colors duration-300"
              @click="closeMobileMenu"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

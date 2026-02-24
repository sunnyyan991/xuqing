<script setup>
import {computed} from 'vue'
import {RouterLink, useRoute} from 'vue-router'
import {usePortfolio} from '@/composables/usePortfolio'

const route = useRoute()
const {getWorkBySlug, getWorkImages, getOtherWorks, navItems} = usePortfolio()

// Get current work data
const currentWork = computed(() => getWorkBySlug(route.params.slug))
const workImages = computed(() => getWorkImages(route.params.slug))
const otherWorks = computed(() => getOtherWorks(route.params.slug, 3))

// Navigation between works
const currentIndex = computed(() => {
  return navItems.value.findIndex(item => item.slug === route.params.slug)
})

const prevWork = computed(() => {
  if (currentIndex.value > 0) {
    return navItems.value[currentIndex.value - 1]
  }
  return null
})

const nextWork = computed(() => {
  if (currentIndex.value < navItems.value.length - 1) {
    return navItems.value[currentIndex.value + 1]
  }
  return null
})
</script>

<template>
  <main class="min-h-screen">
    <!-- Work Not Found -->
    <div v-if="!currentWork" class="pt-40 pb-24">
      <div class="content-container text-center">
        <h1 class="text-2xl font-light mb-4">Work Not Found</h1>
        <p class="text-secondary mb-8 text-sm">The requested work could not be found.</p>
        <RouterLink
            to="/"
            class="inline-block px-6 py-3 text-sm tracking-widest uppercase
                 bg-black text-white border border-black
                 hover:bg-white hover:text-black transition-all duration-300"
        >
          Back to Home
        </RouterLink>
      </div>
    </div>

    <!-- Work Detail -->
    <template v-else>
      <!-- Header Section -->
      <section class="pt-40 pb-16 md:pb-24">
        <div class="content-container">
          <div class="max-w-3xl">
            <span class="text-xs tracking-[0.3em] text-secondary uppercase block mb-4">
              {{ currentWork.order }}
            </span>
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
              {{ currentWork.name }}
            </h1>
          </div>
        </div>
      </section>

      <!-- Cover Image -->
      <section v-if="currentWork.cover" class="pb-8 md:pb-12">
        <div class="content-container">
          
          <div class="w-full bg-neutral-100 relative">
            
            <img 
                v-if="currentWork.coverBg && currentWork.coverIsSvg"
                :src="currentWork.coverBg"
                class="w-full h-auto block z-0"
                alt="cover background"
            />

            <iframe
                v-if="currentWork.coverIsSvg"
                :src="currentWork.cover"
                :title="`${currentWork.name} Cover`"
                class="absolute inset-0 w-full h-full border-0 z-10"
                scrolling="no"
            />
            
            <img
                v-else
                :src="currentWork.cover"
                :alt="`${currentWork.name} Cover`"
                class="w-full h-auto block relative z-20"
            />
          </div>
        </div>
      </section>

      <!-- Work Images (Clean vertical layout like reference) -->
      <section class="pb-24 md:pb-32">
        <div class="content-container">
          <div class="space-y-6 md:space-y-8">
            <div
                v-for="(image, index) in workImages"
                :key="image.name"
                class="w-full overflow-hidden bg-neutral-100"
            >
              <!-- 同名 svg + png: png 作底圖，svg 疊加保留可點擊區域 -->
              <div v-if="image.kind === 'interactive'" class="relative">
                <img
                    :src="image.bgUrl"
                    :alt="`${currentWork.name} - Image ${index + 1}`"
                    class="w-full h-auto block"
                    loading="lazy"
                />
                <iframe
                    :src="image.url"
                    :title="`${currentWork.name} - Interactive Image ${index + 1}`"
                    class="absolute inset-0 w-full h-full border-0 z-10"
                    scrolling="no"
                />
              </div>

              <!-- 單獨 SVG -->
              <iframe
                  v-else-if="image.isSvg"
                  :src="image.url"
                  :title="`${currentWork.name} - Image ${index + 1}`"
                  class="w-full border-0"
                  style="aspect-ratio: 4/3; min-height: 400px;"
                  scrolling="no"
              />

              <!-- 普通圖片 -->
              <img
                  v-else
                  :src="image.url"
                  :alt="`${currentWork.name} - Image ${index + 1}`"
                  class="w-full h-auto"
                  loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Work Navigation -->
      <section class="py-16 border-t border-neutral-200">
        <div class="content-container">
          <div class="flex items-center justify-between">
            <!-- Previous Work -->
            <div class="flex-1">
              <RouterLink
                  v-if="prevWork"
                  :to="`/work/${prevWork.slug}`"
                  class="group inline-flex items-center gap-4 text-secondary hover:text-primary transition-colors duration-300"
              >
                <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 19l-7-7 7-7"/>
                </svg>
                <div>
                  <span class="text-xs tracking-widest uppercase block mb-1">Previous</span>
                  <span class="text-sm">{{ prevWork.name }}</span>
                </div>
              </RouterLink>
            </div>

            <!-- Back to All Works -->
            <RouterLink
                to="/#works"
                class="hidden md:block text-xs tracking-widest uppercase text-secondary hover:text-primary transition-colors duration-300"
            >
              All Works
            </RouterLink>

            <!-- Next Work -->
            <div class="flex-1 text-right">
              <RouterLink
                  v-if="nextWork"
                  :to="`/work/${nextWork.slug}`"
                  class="group inline-flex items-center gap-4 text-secondary hover:text-primary transition-colors duration-300"
              >
                <div>
                  <span class="text-xs tracking-widest uppercase block mb-1">Next</span>
                  <span class="text-sm">{{ nextWork.name }}</span>
                </div>
                <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5l7 7-7 7"/>
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- More Works Section -->
      <section v-if="otherWorks.length > 0" class="py-24 bg-neutral-50">
        <div class="content-container">
          <h2 class="text-xs tracking-[0.3em] uppercase text-secondary mb-16">
            More Works
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <RouterLink
                v-for="work in otherWorks"
                :key="work.slug"
                :to="`/work/${work.slug}`"
                class="work-card group block"
            >
              <div class="relative aspect-[4/3] bg-neutral-100 overflow-hidden mb-5">
                <img
                    :src="work.coverBg ? work.coverBg : work.cover"
                    :alt="work.name"
                    class="w-full h-full object-cover transition-all duration-700 ease-out
                         group-hover:scale-[1.03] group-hover:opacity-90"
                    loading="lazy"
                />
              </div>

              <div class="space-y-1">
                <span class="text-xs tracking-widest text-secondary uppercase">{{ work.order }}</span>
                <h3 class="text-base font-normal text-primary group-hover:opacity-70 transition-opacity duration-300">
                  {{ work.name }}
                </h3>
              </div>
            </RouterLink>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

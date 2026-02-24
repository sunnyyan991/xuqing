<script setup>
import {RouterLink} from 'vue-router'
import {usePortfolio} from '@/composables/usePortfolio'

// Import hero image statically (you can change this path)
import heroImage from '@/assets/hero.png'

const {worksWithCovers, getOtherWorks} = usePortfolio()

// Get other works for the "Other Works" section
const otherWorks = getOtherWorks('', 2)

// Smooth scroll to works section
const scrollToWorks = () => {
  const worksSection = document.getElementById('works')
  if (worksSection) {
    worksSection.scrollIntoView({behavior: 'smooth'})
  }
}
</script>

<template>
  <main>
    <!-- Hero Section (Yellow area in wireframe) -->
    <section class="relative min-h-screen flex items-center justify-center pt-20 md:pt-24 pb-8">
      <div class="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        <div class="relative w-full bg-neutral-100 flex items-center justify-center">
          <!-- Hero Image - 完整顯示整張圖片 -->
          <img
              :src="heroImage"
              alt="Portfolio Hero"
              class="w-full h-auto max-h-[calc(100vh-8rem)] object-contain"
          />

          <!-- View Portfolio Button (Blue area - bottom right corner) -->
          <button
              @click="scrollToWorks"
              class="absolute bottom-4 right-4 md:bottom-8 md:right-8
                   px-6 py-3 md:px-8 md:py-4 text-sm tracking-widest uppercase
                   bg-black text-white border border-black
                   hover:bg-white hover:text-black
                   transition-all duration-300 ease-out"
          >
            View Portfolio
          </button>
        </div>
      </div>
    </section>

    <!-- Works Grid Section (01封面, 02封面, 03封面 area) -->
    <section id="works" class="py-24 md:py-32">
      <div class="content-container">
        <!-- Section Title (optional, can be removed for cleaner look) -->
        <h2 class="text-xs tracking-[0.3em] uppercase text-secondary mb-16 md:mb-20">
          Selected Works
        </h2>

        <!-- Works Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <RouterLink
              v-for="work in worksWithCovers"
              :key="work.slug"
              :to="`/work/${work.slug}`"
              class="work-card group block"
          >
            <!-- Cover Image Container -->
            <div class="relative aspect-[4/3] bg-neutral-100 overflow-hidden mb-5">
              
              <img
                  :src="work.coverBg ? work.coverBg : work.cover"
                  :alt="work.name"
                  class="w-full h-full object-cover transition-all duration-700 ease-out 
                         group-hover:scale-[1.03] group-hover:opacity-90"
                  loading="lazy"
              />
              
            </div>

            <!-- Work Info -->
            <div class="space-y-1">
              <span class="text-xs tracking-widest text-secondary uppercase">
                {{ work.order }}
              </span>
              <h3 class="text-base font-normal text-primary group-hover:opacity-70 transition-opacity duration-300">
                {{ work.name }}
              </h3>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Other Works Section -->
    <section v-if="otherWorks.length > 0" class="py-24 md:py-32 bg-neutral-50">
      <div class="content-container">
        <h2 class="text-xs tracking-[0.3em] uppercase text-secondary mb-16 md:mb-20">
          Other Works
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <RouterLink
              v-for="work in otherWorks"
              :key="work.slug"
              :to="`/work/${work.slug}`"
              class="work-card group block"
          >
            <div class="relative aspect-[16/9] bg-neutral-100 overflow-hidden mb-5">
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
  </main>
</template>

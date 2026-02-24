<script setup>
const currentYear = new Date().getFullYear()
const email = 'yanxuqing341@gmail.com'
</script>

<template>
  <footer class="bg-black text-white py-16 mt-auto">
    <div class="content-container">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <!-- Left: Name (as shown in wireframe) -->
        <div class="text-sm tracking-[0.2em] uppercase">
          Xuqing Yan
        </div>

        <!-- Right: Email (Blue area in wireframe) -->
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <a
              :href="`mailto:${email}`"
              class="text-sm tracking-wide text-neutral-400 hover:text-white transition-colors duration-300"
          >
            {{ email }}
          </a>
          <span class="text-xs text-neutral-600">
            © {{ currentYear }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

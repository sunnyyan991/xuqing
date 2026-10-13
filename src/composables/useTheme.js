import {ref} from 'vue'

const isDark = ref(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)

    try {
      localStorage.setItem('xuqing-theme', isDark.value ? 'dark' : 'light')
    } catch {
      // The theme can still be switched when browser storage is unavailable.
    }
  }

  return {isDark, toggleTheme}
}

import {computed, ref} from 'vue'

/**
 * Portfolio Composable
 *
 * Uses Vite's import.meta.glob to dynamically read the works folder structure.
 * Folder naming convention: XX_ProjectName (e.g., 01_BrandDesign)
 * Each folder should contain:
 *   - cover.png (or .jpg/.webp) - Used as thumbnail (optional, will use first image if not present)
 *   - Other images for the detail page
 */

// Eagerly import all images from works directory (including SVG for placeholders)
const workImages = import.meta.glob('@/assets/works/**/*.{png,jpg,jpeg,webp,gif,svg}', {
  eager: true,
  import: 'default'
})

export function usePortfolio() {
  /**
   * Parse the works folder structure and return organized data
   */
  const parseWorks = () => {
    const works = {}

    for (const path in workImages) {
      // Extract folder name from path
      // Path format: /src/assets/works/01_ProjectName/image.png
      const matches = path.match(/\/works\/([^/]+)\/([^/]+)$/)

      if (matches) {
        const [, folderName, fileName] = matches

        if (!works[folderName]) {
          // Parse folder name: "01_ProjectName" -> { order: "01", name: "ProjectName" }
          const [order, ...nameParts] = folderName.split('_')
          works[folderName] = {
            slug: folderName,
            order: order,
            // 名稱：取下劃線後的部分，下劃線轉空格
            name: nameParts.join(' ').replace(/_/g, ' ') || folderName,
            cover: null,
            coverIsSvg: false,
            images: [],
            allImages: [] // 保存所有圖片用於後備封面
          }
        }

        const imageUrl = workImages[path]
        const lowerFileName = fileName.toLowerCase()
        const isSvg = lowerFileName.endsWith('.svg')

        // 保存所有圖片（包含是否為 SVG 的標記）
        works[folderName].allImages.push({
          name: fileName,
          url: imageUrl,
          isSvg: isSvg
        })

        // Check if this is a cover image
        if (lowerFileName.startsWith('cover')) {
          works[folderName].cover = imageUrl
          works[folderName].coverIsSvg = isSvg
        } else {
          works[folderName].images.push({
            name: fileName,
            url: imageUrl,
            isSvg: isSvg
          })
        }
      }
    }

    // 處理每個作品：如果沒有 cover，使用第一張圖片作為封面
    Object.values(works).forEach(work => {
      // 對所有圖片按名稱排序
      work.allImages.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {numeric: true})
      )

      // 如果沒有指定 cover，使用第一張圖片
      if (!work.cover && work.allImages.length > 0) {
        work.cover = work.allImages[0].url
        work.coverIsSvg = work.allImages[0].isSvg
        // 從 images 中移除被用作 cover 的圖片
        work.images = work.images.filter(img => img.url !== work.cover)
      }

      // 清理臨時數據
      delete work.allImages
    })

    // Convert to array and sort by order
    return Object.values(works).sort((a, b) => {
      return a.order.localeCompare(b.order, undefined, {numeric: true})
    })
  }

  const allWorks = ref(parseWorks())

  /**
   * Get all works with covers (for navigation and grid)
   */
  const worksWithCovers = computed(() => {
    return allWorks.value.filter(work => work.cover !== null)
  })

  /**
   * Get navigation items (order, slug, and display name)
   */
  const navItems = computed(() => {
    return worksWithCovers.value.map(work => ({
      order: work.order,
      slug: work.slug,
      name: work.name
    }))
  })

  /**
   * Get a specific work by slug
   */
  const getWorkBySlug = (slug) => {
    return allWorks.value.find(work => work.slug === slug) || null
  }

  /**
   * Get detail images for a work (excluding cover)
   */
  const getWorkImages = (slug) => {
    const work = getWorkBySlug(slug)
    if (!work) return []

    // Sort images by name for consistent ordering
    return [...work.images].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {numeric: true})
    )
  }

  /**
   * Get other works (for "Other Works" section, excluding current)
   */
  const getOtherWorks = (currentSlug, limit = 3) => {
    return worksWithCovers.value
        .filter(work => work.slug !== currentSlug)
        .slice(0, limit)
  }

  return {
    allWorks,
    worksWithCovers,
    navItems,
    getWorkBySlug,
    getWorkImages,
    getOtherWorks
  }
}

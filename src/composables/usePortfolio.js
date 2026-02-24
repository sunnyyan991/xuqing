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
  const getBaseName = (fileName) => {
    return fileName.replace(/\.[^.]+$/, '').toLowerCase()
  }

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
      // ✨✨✨ 新增逻辑：同名背景图自动匹配 ✨✨✨
      // 如果封面是 SVG，去 allImages 里找一个名字一样、但格式是图片的文件
      if (work.coverIsSvg) {
        // 1. 找到当前封面的文件名对象
        const coverEntry = work.allImages.find(img => img.url === work.cover)
        
        if (coverEntry) {
          // 2. 获取名字主体 (例如 "video.svg" -> "video")
          const baseName = coverEntry.name.substring(0, coverEntry.name.lastIndexOf('.'))
          
          // 3. 寻找双胞胎 (名字主体一样，但不是 SVG 的)
          const twinBg = work.allImages.find(img => 
            !img.isSvg && img.name.startsWith(baseName + '.')
          )
          
          // 4. 找到了就设为背景
          if (twinBg) {
            work.coverBg = twinBg.url
          }
        }
      }
      // ✨✨✨ 新增结束 ✨✨✨
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

    // 1) Sort by file name for stable display order
    const sortedImages = [...work.images].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {numeric: true})
    )

    // 2) Build same-name pairs: foo.svg + foo.png/jpg/webp...
    const pairMap = new Map()
    sortedImages.forEach(image => {
      const baseName = getBaseName(image.name)
      const current = pairMap.get(baseName) || {svg: null, raster: null}

      if (image.isSvg && !current.svg) {
        current.svg = image
      } else if (!image.isSvg && !current.raster) {
        current.raster = image
      }

      pairMap.set(baseName, current)
    })

    // 3) Render each pair only once.
    //    - If a pair exists, return one interactive item (SVG overlay + image background)
    //    - Otherwise return the original single image item
    const consumedUrls = new Set()
    const displayImages = []

    sortedImages.forEach(image => {
      if (consumedUrls.has(image.url)) {
        return
      }

      const baseName = getBaseName(image.name)
      const pair = pairMap.get(baseName)

      if (pair?.svg && pair?.raster) {
        displayImages.push({
          ...pair.svg,
          kind: 'interactive',
          bgUrl: pair.raster.url,
          bgName: pair.raster.name
        })
        consumedUrls.add(pair.svg.url)
        consumedUrls.add(pair.raster.url)
        return
      }

      displayImages.push({
        ...image,
        kind: image.isSvg ? 'svg' : 'image'
      })
      consumedUrls.add(image.url)
    })

    return displayImages
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

import {computed, ref} from 'vue'

/**
 * Portfolio Composable
 *
 * Uses Vite's import.meta.glob to dynamically read the works folder structure.
 * Folder naming convention: XX_ProjectName (e.g., 01_BrandDesign)
 * Each folder should contain:
 *   - cover.png (or .jpg/.webp) - Used as thumbnail
 *   - Other images for the detail page
 */

// Eagerly import all images from works directory
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
                        name: nameParts.join('_').replace(/_/g, ' ') || folderName,
                        cover: null,
                        images: []
                    }
                }

                const imageUrl = workImages[path]
                const lowerFileName = fileName.toLowerCase()

                // Check if this is a cover image
                if (lowerFileName.startsWith('cover')) {
                    works[folderName].cover = imageUrl
                } else {
                    works[folderName].images.push({
                        name: fileName,
                        url: imageUrl
                    })
                }
            }
        }

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
     * Get navigation items (just order numbers)
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

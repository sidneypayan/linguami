/**
 * Helper functions to build media URLs for the new R2 bucket architecture
 *
 * New structure:
 * - Audio materials: audios/materials/{lang}/{filename}
 * - Audio courses: audios/courses/{lang}/{filename}
 * - Audio exercises: audios/exercises/{lang}/{filename}
 * - Images: images/materials/{filename}, images/blog/{filename}, images/ui/{filename}
 */

// Fonction helper pour obtenir l'URL de base R2
function getR2BaseUrl() {
  const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  if (!url) {
    console.error('NEXT_PUBLIC_R2_PUBLIC_URL is not defined in environment variables')
    return ''
  }
  return url.replace(/\/+$/, '')
}

/**
 * Get audio URL for a material
 * @param {Object} material - Material object with lang and audio_filename properties
 * @returns {string|null} Full audio URL or null if no audio
 */
export function getAudioUrl(material) {
  if (!material?.audio_filename) return null
  if (!material?.lang) {
    console.warn('getAudioUrl: material.lang is missing, audio may not load correctly')
    return null
  }
  const baseUrl = getR2BaseUrl()
  if (!baseUrl) return null
  const lang = material.lang.replace(/^\/+/, '')
  const audio = material.audio_filename.replace(/^\/+/, '')
  return `${baseUrl}/audios/materials/${lang}/${audio}`
}

/**
 * Get image URL for a material
 * @param {Object} material - Material object with image_filename or img property
 * @returns {string|null} Full image URL or null if no image
 */
export function getMaterialImageUrl(material) {
  const imageFile = material?.image_filename || material?.img
  if (!imageFile) return null
  const baseUrl = getR2BaseUrl()
  if (!baseUrl) return null
  const file = imageFile.replace(/^\/+/, '')
  return `${baseUrl}/images/materials/${file}`
}

/**
 * Get image URL for a blog post
 * @param {Object} post - Blog post object with img property or frontmatter.img
 * @returns {string|null} Full image URL or null if no image
 */
export function getBlogImageUrl(post) {
  const imageFile = post?.img || post?.frontmatter?.img
  if (!imageFile) return null

  // Mapping temporaire pour images non uploadées sur R2
  const unsplashFallback = {
    '5-common-mistakes.jpg': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=630&fit=crop&q=80', // Livre ouvert - apprentissage
    'french-vs-russian.jpg': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop&q=80', // Drapeaux/international
    'how-to-learn-french.jpg': 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&h=630&fit=crop&q=80', // Tour Eiffel
  }

  // Si l'image a un fallback Unsplash, l'utiliser
  if (unsplashFallback[imageFile]) {
    return unsplashFallback[imageFile]
  }

  // Sinon, chercher sur R2
  const baseUrl = getR2BaseUrl()
  if (!baseUrl) return null
  const file = imageFile.replace(/^\/+/, '')
  return `${baseUrl}/images/blog/${file}`
}

/**
 * Get image URL for UI elements (logos, icons, etc.)
 * @param {string} filename - Image filename
 * @returns {string} Full image URL
 */
export function getUIImageUrl(filename) {
  const baseUrl = getR2BaseUrl()
  if (!baseUrl) return null
  const file = filename.replace(/^\/+/, '')
  return `${baseUrl}/images/ui/${file}`
}

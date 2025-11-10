/**
 * Helper functions to build media URLs for the new R2 bucket architecture
 *
 * New structure:
 * - Audio: audio/{lang}/{filename}
 * - Images: image/materials/{filename}, image/blog/{filename}, image/ui/{filename}
 */

/**
 * Get audio URL for a material
 * @param {Object} material - Material object with lang and audio properties
 * @returns {string|null} Full audio URL or null if no audio
 */
export function getAudioUrl(material) {
  if (!material?.audio) return null
  if (!material?.lang) {
    console.warn('getAudioUrl: material.lang is missing, audio may not load correctly')
    return null
  }
  // Normaliser les slashes pour éviter les doubles slashes
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_AUDIO.replace(/\/+$/, '')
  const lang = material.lang.replace(/^\/+/, '')
  const audio = material.audio.replace(/^\/+/, '')
  return `${baseUrl}/${lang}/${audio}`
}

/**
 * Get image URL for a material
 * @param {Object} material - Material object with image or img property
 * @returns {string|null} Full image URL or null if no image
 */
export function getMaterialImageUrl(material) {
  const imageFile = material?.image || material?.img
  if (!imageFile) return null
  // Normaliser les slashes pour éviter les doubles slashes
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_IMAGE.replace(/\/+$/, '')
  const file = imageFile.replace(/^\/+/, '')
  return `${baseUrl}/materials/${file}`
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
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_IMAGE.replace(/\/+$/, '')
  const file = imageFile.replace(/^\/+/, '')
  return `${baseUrl}/blog/${file}`
}

/**
 * Get image URL for UI elements (logos, icons, etc.)
 * @param {string} filename - Image filename
 * @returns {string} Full image URL
 */
export function getUIImageUrl(filename) {
  // Normaliser les slashes pour éviter les doubles slashes
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_IMAGE.replace(/\/+$/, '')
  const file = filename.replace(/^\/+/, '')
  return `${baseUrl}/ui/${file}`
}

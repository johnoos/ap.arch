// ap.arch/index.js

/**
 * This function is the entry point for your architecture package.
 * When the website calls `eleventyConfig.addPlugin(apArch)`, 
 * this code runs automatically.
 */
export default function(eleventyConfig, options = {}) {
  // Example: Add a universal filter provided by the architecture
  eleventyConfig.addFilter("archDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString();
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/ap.arch/assets": "assets",
    "node_modules/ap.arch/css": "css",
    "node_modules/ap.arch/scripts": "scripts"
  });
}  
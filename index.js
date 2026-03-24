// ap.arch/index.js

import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


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

  // Use absolute paths resolved from the plugin's own location
  const archDir = __dirname; 

  eleventyConfig.addPassthroughCopy({
    [path.join(archDir, "assets/")]: "assets/"
  });
}  
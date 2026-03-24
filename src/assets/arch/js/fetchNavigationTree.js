// node_modules/ap.arch/src/assets/arch/js/fetchNavigationTree.js (Node.js version)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Jump up from arch/js to assets/ then into local/pdfs
const PATHS = { 
  pdfSource: path.resolve(__dirname, '../../local/pdfs') 
};

export const getCleanedTitle = (str) => {
  if (!str) return "";
  return str.replace('.pdf', '')
    .replace(/^\d+[-_]*/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .split(" ")
    .map(word => {
      if (/^phd$/i.test(word)) return "PhD"; 
      if (/[A-Z]{2,}/.test(word) || /\d/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
};

const getSlug = (str) => str.toLowerCase().replace('.pdf', '').replace(/^\d+[-_]*/, "").replace(/[^a-z0-9]/g, '-');

export default () => {
  if (!fs.existsSync(PATHS.pdfSource)) {
    console.warn(`[ap.arch] PDF Source not found at: ${PATHS.pdfSource}`);
    return [];
  }

  return fs.readdirSync(PATHS.pdfSource, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(folder => {
      const folderNameOnDisk = folder.name;
      const catPath = path.join(PATHS.pdfSource, folderNameOnDisk);

      const pdfFiles = fs.readdirSync(catPath)
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .map(filename => {
          const baseNoExt = filename.replace('.pdf', '');
          return {
            nameOnDisk: filename,
            cleanedTitle: getCleanedTitle(baseNoExt),
            slug: getSlug(baseNoExt),
            // This URL must match your website's passthrough destination
            url: `/assets/pdfs/${folderNameOnDisk}/${filename}`,
            previewUrl: `/assets/previews/${baseNoExt.toLowerCase()}-1.png`
          };
        });

      return {
        nameOnDisk: folderNameOnDisk,
        cleanedTitle: getCleanedTitle(folderNameOnDisk),
        slug: getSlug(folderNameOnDisk),
        pdfs: pdfFiles
      };
    })
    .filter(cat => cat.pdfs.length > 0)
    .sort((a, b) => {
      const getOrder = (n) => {
        const match = n.match(/^(\d+)-/);
        return match ? parseInt(match[1], 10) : 999;
      };
      return getOrder(a.nameOnDisk) - getOrder(b.nameOnDisk);
    });
};
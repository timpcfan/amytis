import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const booksDir = path.join(process.cwd(), 'content', 'books');

function updateBookMetadata(slug: string) {
  const bookPath = path.join(booksDir, slug);
  if (!fs.existsSync(bookPath)) {
    console.error(`Book directory not found: ${bookPath}`);
    return;
  }

  const indexPath = path.join(bookPath, 'index.mdx');
  const indexMdPath = path.join(bookPath, 'index.md');
  
  let targetIndexPath = '';
  if (fs.existsSync(indexPath)) targetIndexPath = indexPath;
  else if (fs.existsSync(indexMdPath)) targetIndexPath = indexMdPath;
  else {
    console.error(`Book index file not found in ${bookPath}`);
    return;
  }

  // 1. Find all potential chapter files/folders
  const items = fs.readdirSync(bookPath, { withFileTypes: true });
  const chapters: { title: string; id: string }[] = [];

  // Sort naturally (so 01 comes before 10)
  items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  for (const item of items) {
    if (item.name === 'index.mdx' || item.name === 'index.md' || item.name === 'images' || item.name === '.DS_Store') continue;

    let id = '';
    let fullPath = '';

    if (item.isFile() && (item.name.endsWith('.mdx') || item.name.endsWith('.md'))) {
      id = item.name.replace(/\.mdx?$/, '');
      fullPath = path.join(bookPath, item.name);
    } else if (item.isDirectory()) {
      const folderIndexMdx = path.join(bookPath, item.name, 'index.mdx');
      const folderIndexMd = path.join(bookPath, item.name, 'index.md');
      if (fs.existsSync(folderIndexMdx)) {
        id = item.name;
        fullPath = folderIndexMdx;
      } else if (fs.existsSync(folderIndexMd)) {
        id = item.name;
        fullPath = folderIndexMd;
      }
    }

    if (id && fullPath) {
      try {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContent);
        chapters.push({
          title: data.title || id,
          id: id
        });
      } catch (e) {
        console.warn(`Could not parse ${fullPath}, skipping...`);
      }
    }
  }

  // 2. Update index file frontmatter
  const indexContent = fs.readFileSync(targetIndexPath, 'utf8');
  const indexMatter = matter(indexContent);
  
  // We overwrite the flat chapters list. 
  // If the user has complex "parts", they will need to re-group them, 
  // but this ensures all files are present.
  indexMatter.data.chapters = chapters;

  // Use matter.stringify which handles YAML formatting correctly
  const newContent = indexMatter.stringify('');
  fs.writeFileSync(targetIndexPath, newContent);

  console.log(`
✓ Successfully updated chapters for book: ${slug}`);
  console.log(`  Path: ${targetIndexPath}
`);
  chapters.forEach(ch => console.log(`  - [${ch.id}] ${ch.title}`));
}

const args = process.argv.slice(2);
const slug = args[0];

if (!slug) {
  console.log("Usage: bun scripts/update-book-metadata.ts <book-slug>");
  process.exit(1);
}

updateBookMetadata(slug);

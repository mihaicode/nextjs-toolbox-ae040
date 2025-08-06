#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Formats markdown content by ensuring there's a blank line after each heading
 * @param {string} content - The markdown content to format
 * @returns {string} - The formatted markdown content
 */
function formatMarkdown(content) {
  const lines = content.split('\n');
  const formattedLines = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
    
    // Track if we're inside a code block
    if (currentLine.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }
    
    // Add current line
    formattedLines.push(currentLine);
    
    // Check if current line is a heading (starts with #) and we're not in a code block
    if (!inCodeBlock && currentLine.trim().match(/^#+\s+/)) {
      // If the next line exists and is not blank, add a blank line
      if (nextLine !== null && nextLine.trim() !== '') {
        formattedLines.push('');
      }
    }
  }
  
  return formattedLines.join('\n');
}

/**
 * Process a single markdown file
 * @param {string} filePath - Path to the markdown file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const formattedContent = formatMarkdown(content);
    
    // Only write if content changed
    if (content !== formattedContent) {
      fs.writeFileSync(filePath, formattedContent);
      console.log(`✓ Formatted: ${filePath}`);
      return true;
    } else {
      console.log(`- No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Find all markdown files in a directory recursively
 * @param {string} dir - Directory to search
 * @param {string[]} extensions - File extensions to include
 * @returns {string[]} - Array of markdown file paths
 */
function findMarkdownFiles(dir, extensions = ['.md', '.mdx']) {
  const files = [];
  
  function searchDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and .git directories
        if (!['node_modules', '.git', '.next', 'out'].includes(entry.name)) {
          searchDir(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  searchDir(dir);
  return files;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Process all markdown files in current directory
    const currentDir = process.cwd();
    const markdownFiles = findMarkdownFiles(currentDir);
    
    if (markdownFiles.length === 0) {
      console.log('No markdown files found.');
      return;
    }
    
    console.log(`Found ${markdownFiles.length} markdown file(s):`);
    let changedFiles = 0;
    
    markdownFiles.forEach(file => {
      if (processFile(file)) {
        changedFiles++;
      }
    });
    
    console.log(`\nCompleted! ${changedFiles} file(s) were formatted.`);
  } else {
    // Process specific files provided as arguments
    let changedFiles = 0;
    
    args.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        if (processFile(filePath)) {
          changedFiles++;
        }
      } else {
        console.error(`✗ File not found: ${filePath}`);
      }
    });
    
    console.log(`\nCompleted! ${changedFiles} file(s) were formatted.`);
  }
}

// Export functions for testing
module.exports = {
  formatMarkdown,
  processFile,
  findMarkdownFiles
};

// Run main function if this script is executed directly
if (require.main === module) {
  main();
}
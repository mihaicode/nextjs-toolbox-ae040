# Markdown Formatter

A utility tool that automatically formats markdown files by ensuring there's a blank line after each heading.

## Features

- Automatically adds blank lines after markdown headings (h1-h6) when missing
- Ignores headings inside code blocks to avoid formatting code examples
- Processes all markdown files in the project or specific files
- Preserves existing formatting when no changes are needed

## Usage

### Format all markdown files in the project

```bash
npm run format-markdown
```

### Format specific files

```bash
node utils/markdown-formatter.js README.md docs/guide.md
```

### Use the utility directly

```bash
node utils/markdown-formatter.js
```

## Examples

### Before formatting:

```markdown
# Main Title
Some intro text
## Section 1
Content here
### Subsection
More content
```

### After formatting:

```markdown
# Main Title

Some intro text
## Section 1

Content here
### Subsection

More content
```

### Code blocks are preserved:

```markdown
# Installation

To install dependencies:

\`\`\`bash
npm install
# This comment won't get a blank line after it
\`\`\`

## Usage

The tool works great!
```

## Implementation Details

The formatter:
1. Tracks whether it's currently inside a code block (between \`\`\` markers)
2. Identifies markdown headings using the pattern `/^#+\s+/`
3. Only processes headings that are not inside code blocks
4. Adds a blank line after headings only when the next line contains content
5. Preserves all existing formatting when no changes are needed

## Testing

Run the tests to verify the formatter works correctly:

```bash
npm test
```

The test suite covers:
- Basic heading formatting
- Multiple headings
- Code block handling
- Mixed content scenarios
- Various heading levels (h1-h6)
- Edge cases like headings at end of file
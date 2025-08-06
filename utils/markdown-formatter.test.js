const { formatMarkdown } = require('../utils/markdown-formatter');

describe('Markdown Formatter', () => {
  test('should add blank line after heading when missing', () => {
    const input = `# Title
Some content`;
    
    const expected = `# Title

Some content`;
    
    const result = formatMarkdown(input);
    expect(result).toBe(expected);
  });

  test('should not add blank line after heading when already present', () => {
    const input = `# Title

Some content`;
    
    const result = formatMarkdown(input);
    expect(result).toBe(input);
  });

  test('should handle multiple headings', () => {
    const input = `# Title 1
Content 1
## Title 2
Content 2`;
    
    const expected = `# Title 1

Content 1
## Title 2

Content 2`;
    
    const result = formatMarkdown(input);
    expect(result).toBe(expected);
  });

  test('should not add blank line after heading inside code blocks', () => {
    const input = `\`\`\`bash
# This is not a heading
some command
\`\`\``;
    
    const result = formatMarkdown(input);
    expect(result).toBe(input);
  });

  test('should handle mixed content correctly', () => {
    const input = `# Main Title
Some intro text

## Section 1
Content here

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

## Section 2
More content`;
    
    const expected = `# Main Title

Some intro text

## Section 1

Content here

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

## Section 2

More content`;
    
    const result = formatMarkdown(input);
    expect(result).toBe(expected);
  });

  test('should handle heading at end of file', () => {
    const input = `# Title`;
    
    const result = formatMarkdown(input);
    expect(result).toBe(input); // No change needed as there's no next line
  });

  test('should handle various heading levels', () => {
    const input = `# H1
## H2
### H3
#### H4
##### H5
###### H6
Content`;
    
    const expected = `# H1

## H2

### H3

#### H4

##### H5

###### H6

Content`;
    
    const result = formatMarkdown(input);
    expect(result).toBe(expected);
  });
});
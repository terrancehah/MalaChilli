---
name: update-documentation
description: Update project documentation after code changes, ensuring all docs reflect recent implementation updates with industry best practices for technical writing
---

# Documentation Update Skill

This skill helps maintain accurate and up-to-date project documentation after code changes, following industry-standard best practices for technical writing.

## Quick Reference - Documentation Patterns

### Common Documentation Templates

**Feature Documentation:**

```markdown
# Feature Name

## Overview
Brief description of what this feature does and why it exists.

## Prerequisites
- Requirement 1
- Requirement 2

## How to Use
Step-by-step instructions with code examples.

## Examples
Real-world usage scenarios.

## Troubleshooting
Common issues and solutions.

## Related
Links to related documentation.
```

**API Endpoint Documentation:**

```markdown
## POST /api/endpoint

Brief description of what this endpoint does.

**Authentication Required:** Yes

**Request Body:**
\`\`\`json
{
  "field": "value"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

**Error Responses:**
- 400: Invalid request
- 401: Unauthorized
```

**Component Documentation:**

```markdown
## ComponentName

Description of component purpose.

**Props:**
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | string | Yes | - | Description |

**Example:**
\`\`\`tsx
<ComponentName prop1="value" />
\`\`\`
```

## When to Use This Skill

- After implementing new features
- After UI/UX changes
- After design system updates
- After API changes
- After architecture modifications

## Documentation Update Checklist

### 1. Review Recent Changes

- [ ] Review recent commits and PRs
- [ ] Identify which components/features were modified
- [ ] Note any breaking changes or new patterns

### 2. Update Technical Documentation

- [ ] **Design System** (`docs/05-design-system.md`)
  - Typography changes
  - Color palette updates
  - Component pattern changes
  - Spacing/layout modifications
  
- [ ] **Technical Reference** (`docs/02-technical-reference.md`)
  - API endpoint changes
  - Database schema updates
  - Authentication flow changes
  
- [ ] **Implementation Guides** (`docs/03-implementation-guides.md`)
  - New feature implementation steps
  - Updated code examples
  - New best practices

### 3. Update Project Overview

- [ ] **Project Overview** (`docs/01-project-overview.md`)
  - Feature list updates
  - Architecture diagram changes
  - Technology stack updates

### 4. Verify Documentation Quality

**Accuracy & Completeness:**

- [ ] All code examples are **tested and working**
- [ ] All commands have been **verified** in the correct environment
- [ ] All links are **working** (no 404s)
- [ ] All file paths are **accurate** and use correct casing
- [ ] Screenshots/diagrams are **up-to-date** and show current UI
- [ ] Version numbers are **current** and accurate

**Consistency & Style:**

- [ ] **Consistent terminology** used throughout (check word list)
- [ ] **Consistent formatting** (headings, code blocks, lists)
- [ ] **Consistent tone** (conversational, helpful, professional)
- [ ] **Proper heading hierarchy** (H1 → H2 → H3, no skipping)
- [ ] **Consistent capitalization** for product names and features

**Clarity & Usability:**

- [ ] **No assumed knowledge** - concepts are explained
- [ ] **Clear examples** provided for complex topics
- [ ] **Scannable structure** with headings and lists
- [ ] **No jargon** without explanation
- [ ] **Actionable content** - users know what to do next

**Technical Accuracy:**

- [ ] Code examples include **all necessary imports**
- [ ] Code examples show **proper file structure context**
- [ ] API endpoints are **correctly documented**
- [ ] Error messages match **actual system output**
- [ ] Configuration examples are **complete and valid**

### 5. Test Documentation Usability

**User Testing (if possible):**

- [ ] Have someone **unfamiliar with the feature** try to follow the docs
- [ ] Collect feedback on **confusing sections**
- [ ] Time how long it takes to **complete documented tasks**
- [ ] Ask if anything was **missing or unclear**

**Self-Review Checklist:**

- [ ] Read the document **out loud** to catch awkward phrasing
- [ ] Take a **break and return** with fresh eyes
- [ ] Check if you can **follow your own instructions** without prior knowledge
- [ ] Verify **all prerequisites** are clearly stated

### 6. Commit Documentation

- [ ] Use **descriptive commit message** following conventional commits
- [ ] Reference **related PRs/issues** in commit message
- [ ] Push to **appropriate branch**
- [ ] Create **pull request** with documentation changes summary

### 7. Maintenance & Updates

**Regular Review Schedule:**

- [ ] Review documentation **after each major release**
- [ ] Update screenshots/examples **when UI changes**
- [ ] Check for **broken links** monthly
- [ ] Verify code examples still work with **latest dependencies**

**Feedback Collection:**

- [ ] Add **"Was this helpful?"** micro-surveys to docs
- [ ] Monitor **user questions** in support channels
- [ ] Track **most-viewed pages** to prioritize updates
- [ ] Collect **user feedback** on confusing sections

## Documentation Standards

### Writing Style & Tone

**Tone Guidelines:**

- **Conversational but Professional**: Write as if explaining to a colleague, not lecturing
- **Clear and Direct**: Avoid jargon unless necessary; explain technical terms when first used
- **Helpful and Encouraging**: Guide users through tasks with positive, supportive language
- **Consistent Voice**: Maintain the same tone throughout all documentation

**Language Best Practices:**

- Use **present tense** for current actions ("The system validates..." not "The system will validate...")
- Use **active voice** for clarity ("Click the button" not "The button should be clicked")
- Use **second person** when addressing users ("You can configure..." not "Users can configure...")
- **Don't assume prior knowledge**: Explain concepts even if they seem basic
- **Over-explain rather than under-explain**: New users will appreciate it; experienced users will skim

**Example - Good vs Bad:**

```markdown
❌ Bad: "Configure the authentication middleware in the app initialization."
✅ Good: "To set up authentication, add the authentication middleware to your app's initialization file. This ensures all requests are checked for valid credentials before reaching your routes."
```

### Code Examples & Snippets

**Code Documentation Rules:**

- **Always test code** before documenting - untested code erodes trust
- **Use syntax highlighting** with proper language tags (```tsx,```bash, etc.)
- **Include comments** for complex logic or non-obvious decisions
- **Show context**: Don't just show a snippet, show where it fits in the file
- **Provide copy-paste ready examples** with all necessary imports
- **Show multiple approaches** when applicable (beginner vs advanced)
- **Include expected output** or results when relevant

**Code Example Template:**

```tsx
// File: src/components/Example.tsx
import { useState } from 'react';

/**
 * Example component demonstrating responsive typography
 * Uses mobile-first approach with Tailwind breakpoints
 */
export function Example() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      {/* Mobile: text-base (16px), Desktop: text-lg (18px) */}
      <p className="text-base sm:text-lg">
        Count: {count}
      </p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Formatting & Structure

**Consistency is Key:**

- Use **consistent heading hierarchy** (H1 for page title, H2 for sections, H3 for subsections)
- Use **consistent terminology** throughout (create a word list if needed)
- Use **consistent formatting** for similar elements (all file paths in code blocks, all commands in bash blocks)
- Use **consistent capitalization** (decide on "API" vs "Api" and stick to it)

**Document Structure:**

1. **Title**: Clear, descriptive page title
2. **Overview/Introduction**: Brief explanation of what this document covers
3. **Prerequisites** (if applicable): What users need before starting
4. **Main Content**: Organized with clear headings and subheadings
5. **Examples**: Real-world usage examples
6. **Troubleshooting** (if applicable): Common issues and solutions
7. **Related Resources**: Links to related documentation

**Formatting Best Practices:**

- **Break up text** with headings, lists, code blocks, and quotes
- **Use tables** for comparisons or structured data
- **Use callouts/blockquotes** for important notes, warnings, or tips
- **Use numbered lists** for sequential steps
- **Use bullet points** for non-sequential items
- **Add visual hierarchy** with proper spacing and indentation

**Callout Examples:**

```markdown
> **Note:** This feature requires authentication to be enabled.

> **Warning:** Deleting this will permanently remove all associated data.

> **Tip:** You can speed up this process by using the CLI command.
```

### Accessibility & Scannability

**Make Content Scannable:**

- **Front-load important information** in paragraphs
- **Use descriptive headings** that tell users what they'll learn
- **Keep paragraphs short** (3-5 sentences maximum)
- **Use bold** for key terms or important points
- **Add a table of contents** for documents longer than 3 sections
- **Include quick-start sections** for users who want to jump right in

**Navigation Aids:**

- **Breadcrumbs** for multi-level documentation
- **"On this page"** navigation for long documents
- **"Next steps"** or "Related" sections at the end
- **Search functionality** for large documentation sites

## Common Documentation Sections to Update

1. **After Typography Changes**: Update design system typography section
2. **After Component Changes**: Update component patterns and examples
3. **After API Changes**: Update technical reference and implementation guides
4. **After Database Changes**: Update schema documentation and migration guides
5. **After UI/UX Changes**: Update design system and user guides

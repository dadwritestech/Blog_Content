# Docusaurus Theme Swizzling Guide
*Complete Instructions for Safe Theme Customization*

## Table of Contents
1. [Overview](#overview)
2. [Safety Levels](#safety-levels)
3. [Swizzling Methods](#swizzling-methods)
4. [Component Categories](#component-categories)
5. [Step-by-Step Instructions](#step-by-step-instructions)
6. [Best Practices](#best-practices)
7. [Common Use Cases](#common-use-cases)
8. [Troubleshooting](#troubleshooting)

## Overview

**Swizzling** in Docusaurus allows you to override theme components with your own implementations. Think of it as "monkey patching" for React components - you can replace or enhance any part of the default theme.

### Key Benefits
- Deep customization beyond CSS
- Component-level control
- Maintain upgrade compatibility (when done correctly)
- Granular modifications

### When to Use Swizzling
- CSS customization isn't sufficient
- Need to add custom functionality to existing components
- Want to completely redesign specific UI elements
- Adding custom elements to layout components

## Safety Levels

Docusaurus categorizes components into three safety levels:

### 🟢 Safe
- **Stable public API** - Breaking changes only in major versions
- **Recommended for customization**
- **Examples**: Footer, Navbar, CodeBlock, ColorModeToggle

### 🟡 Unsafe
- **Implementation details** - May break in minor versions
- **Use with caution** - Requires maintenance on updates
- **Examples**: AnnouncementBar, BackToTopButton, Blog components

### 🔴 Forbidden
- **Cannot be wrapped** - Only ejection allowed
- **Advanced use cases only**
- **Examples**: Some folder-level components, ComponentTypes

## Swizzling Methods

### 1. Wrapping (Recommended)
**Enhances** the original component while keeping it intact.

```bash
npm run swizzle @docusaurus/theme-classic Footer -- --wrap
```

**Benefits:**
- Safer upgrades
- Less code to maintain
- Original functionality preserved
- Can add elements before/after original

**Example Output:**
```jsx
// src/theme/Footer.js
import OriginalFooter from '@theme-original/Footer';

export default function Footer(props) {
  return (
    <>
      <div className="custom-footer-top">
        {/* Your custom content */}
      </div>
      <OriginalFooter {...props} />
    </>
  );
}
```

### 2. Ejecting (Use with Caution)
**Replaces** the original component entirely.

```bash
npm run swizzle @docusaurus/theme-classic Footer -- --eject
```

**Benefits:**
- Complete control
- Can modify internal logic
- Full customization freedom

**Risks:**
- More code to maintain
- Harder to upgrade
- May copy complex internal code

## Component Categories

### Layout Components (High Impact)
| Component | Wrap Safety | Eject Safety | Use Case |
|-----------|-------------|--------------|----------|
| `Layout` | Unsafe | Unsafe | Global layout changes |
| `Navbar` | Unsafe | Unsafe | Navigation customization |
| `Footer` | Safe | Safe | Footer content/styling |

### Content Components (Medium Impact)
| Component | Wrap Safety | Eject Safety | Use Case |
|-----------|-------------|--------------|----------|
| `BlogPostItem` | Unsafe | Unsafe | Blog post layout |
| `BlogListPage` | Unsafe | Unsafe | Blog listing page |
| `MDXContent` | Safe | Safe | MDX rendering wrapper |
| `CodeBlock` | Safe | Safe | Code syntax highlighting |

### UI Elements (Low Impact)
| Component | Wrap Safety | Eject Safety | Use Case |
|-----------|-------------|--------------|----------|
| `ColorModeToggle` | Safe | Safe | Dark/light mode button |
| `SearchBar` | Safe | Safe | Search functionality |
| `SkipToContent` | Safe | Safe | Accessibility features |

### Icons & Small Elements
| Component | Wrap Safety | Eject Safety | Use Case |
|-----------|-------------|--------------|----------|
| `Icon/DarkMode` | Safe | Safe | Custom dark mode icon |
| `Icon/LightMode` | Safe | Safe | Custom light mode icon |
| `Icon/Menu` | Safe | Safe | Custom hamburger menu |

## Step-by-Step Instructions

### Step 1: Explore Available Components
```bash
# List all swizzleable components
npm run swizzle -- --list

# Interactive selection
npm run swizzle
```

### Step 2: Choose Your Component
Start with **Safe** components for your first customizations:
- `Footer` - Add custom links, social media
- `ColorModeToggle` - Custom theme switcher
- `CodeBlock` - Enhanced code display
- `NotFound` - Custom 404 page

### Step 3: Decide on Method
- **Wrap** for adding content or minor modifications
- **Eject** only when you need to modify internal logic

### Step 4: Execute Swizzling
```bash
# Wrapping (recommended first step)
npm run swizzle @docusaurus/theme-classic Footer -- --wrap

# Ejecting (when needed)
npm run swizzle @docusaurus/theme-classic Footer -- --eject
```

### Step 5: Customize the Component
1. Navigate to `src/theme/[ComponentName]/`
2. Modify the generated component
3. Test thoroughly
4. Document your changes

### Step 6: Test and Validate
```bash
# Start development server
npm start

# Build and test
npm run build
npm run serve
```

## Best Practices

### 🔑 Golden Rules
1. **Prefer wrapping over ejecting**
2. **Start with Safe components**
3. **Document all customizations**
4. **Test across Docusaurus versions**
5. **Keep modifications minimal**

### 📝 Documentation Template
Add this comment to the top of each swizzled component:

```jsx
/**
 * SWIZZLED COMPONENT: Footer
 * Method: Wrapped
 * Date: 2025-01-20
 * Changes: Added custom social media links and newsletter signup
 * Upgrade Notes: Safe to upgrade, wrapper pattern used
 */
```

### 🧪 Testing Checklist
- [ ] Component renders correctly
- [ ] Responsive design works
- [ ] Dark/light themes work
- [ ] Accessibility features intact
- [ ] Build succeeds without warnings
- [ ] Original functionality preserved (wrapping)

### 📁 File Organization
```
src/
├── theme/
│   ├── Footer/           # Swizzled footer
│   │   └── index.js
│   ├── ColorModeToggle/  # Swizzled theme toggle
│   │   └── index.js
│   └── BlogPostItem/     # Custom blog layout
│       └── index.js
├── components/           # Your custom components
└── css/                  # Custom styles
```

## Common Use Cases

### 1. Custom Footer with Social Links
```bash
npm run swizzle @docusaurus/theme-classic Footer -- --wrap
```

```jsx
import OriginalFooter from '@theme-original/Footer';
import styles from './styles.module.css';

export default function Footer(props) {
  return (
    <>
      <div className={styles.customFooter}>
        <div className={styles.socialLinks}>
          <a href="https://twitter.com/yourusername">Twitter</a>
          <a href="https://linkedin.com/in/yourprofile">LinkedIn</a>
        </div>
      </div>
      <OriginalFooter {...props} />
    </>
  );
}
```

### 2. Enhanced Color Mode Toggle
```bash
npm run swizzle @docusaurus/theme-classic ColorModeToggle -- --wrap
```

### 3. Custom 404 Page
```bash
npm run swizzle @docusaurus/theme-classic NotFound -- --eject
```

### 4. Blog Post Enhancements
```bash
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --wrap
```

### 5. Custom Code Block Features
```bash
npm run swizzle @docusaurus/theme-classic CodeBlock -- --wrap
```

## Troubleshooting

### Common Issues

#### 1. Component Not Found Error
```
Error: Cannot resolve module '@theme/Footer'
```
**Solution:** Restart development server after swizzling.

#### 2. Build Failures
```
Module build failed: SyntaxError
```
**Solution:** Check JSX syntax and imports in swizzled components.

#### 3. Styling Issues
**Solution:** 
- Import CSS modules correctly
- Check CSS specificity
- Ensure responsive styles

#### 4. TypeScript Errors
**Solution:**
- Add proper type definitions
- Use `@docusaurus/types` for theme types

#### 5. Upgrade Breaks Customizations
**Solution:**
- Review changelogs for breaking changes
- Re-test swizzled components
- Consider re-swizzling if major changes occurred

### Debug Commands
```bash
# Clear cache and restart
npm run clear
npm start

# Build with verbose output
npm run build -- --verbose

# Type checking
npm run typecheck
```

### Recovery Steps
If swizzling breaks your site:

1. **Backup and revert:**
   ```bash
   git checkout HEAD -- src/theme/
   ```

2. **Gradual re-implementation:**
   - Start with wrapping instead of ejecting
   - Test each component individually
   - Add logging to debug issues

3. **Community support:**
   - Check [Docusaurus GitHub Discussions](https://github.com/facebook/docusaurus/discussions)
   - Search existing issues
   - Ask in Discord community

## Maintenance Guidelines

### Regular Tasks
1. **Review swizzled components** when updating Docusaurus
2. **Test customizations** after any upgrade
3. **Document breaking changes** and fixes
4. **Monitor component safety levels** in new versions

### Version Upgrade Checklist
- [ ] Backup current swizzled components
- [ ] Update Docusaurus version
- [ ] Test all swizzled components
- [ ] Check for deprecation warnings
- [ ] Update component implementations if needed
- [ ] Document any required changes

### Best Practices for Long-term Maintenance
- Keep swizzled components simple
- Use composition over modification
- Prefer CSS-only changes when possible
- Maintain comprehensive documentation
- Regular testing across different scenarios

---

**Remember:** The smaller the change, the safer the customization. Start simple and gradually enhance your theme as needed.
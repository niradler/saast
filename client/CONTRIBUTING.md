# Contributing to ChatSaaS

We're thrilled that you're interested in contributing to ChatSaaS! This document provides guidelines and information for contributors.

## 🤝 **Code of Conduct**

By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to be respectful, inclusive, and constructive.

## 🚀 **Getting Started**

### **Development Setup**

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/chatsaas.git
   cd chatsaas/client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

### **Project Structure Understanding**

Before contributing, familiarize yourself with:
- [Project Architecture](./DEVELOPMENT.md#architecture)
- [Component Guidelines](./DEVELOPMENT.md#components)
- [State Management](./DEVELOPMENT.md#state-management)
- [Styling Guidelines](./DEVELOPMENT.md#styling)

## 📝 **Types of Contributions**

We welcome various types of contributions:

### **🐛 Bug Fixes**
- Fix existing functionality issues
- Improve error handling
- Resolve performance problems

### **✨ New Features**
- Add new UI components
- Implement new chat features
- Enhance user experience

### **📚 Documentation**
- Improve existing documentation
- Add code examples
- Create tutorials

### **🎨 Design Improvements**
- Enhance UI/UX design
- Improve mobile responsiveness
- Add new themes

### **⚡ Performance Optimizations**
- Reduce bundle size
- Improve rendering performance
- Optimize API calls

## 🔄 **Development Workflow**

### **1. Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### **2. Development Guidelines**

#### **Code Quality**
- Write TypeScript for all new code
- Follow existing code patterns
- Add proper error handling
- Include comprehensive comments

#### **Component Guidelines**
```typescript
// ✅ Good: Proper component structure
interface ComponentProps {
  title: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Component({ title, onClick, variant = 'primary' }: ComponentProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'base-classes',
        variant === 'primary' ? 'primary-classes' : 'secondary-classes'
      )}
    >
      {title}
    </button>
  );
}
```

#### **State Management**
```typescript
// ✅ Good: Proper Zustand store structure
interface StoreState {
  data: Item[];
  isLoading: boolean;
  error: string | null;
}

interface StoreActions {
  fetchData: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState & StoreActions>()((set, get) => ({
  // State
  data: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchData: async () => {
    // Implementation
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
```

#### **Styling Guidelines**
```tsx
// ✅ Good: Mobile-first responsive design
<div className="
  flex flex-col space-y-2
  sm:flex-row sm:space-y-0 sm:space-x-4
  lg:space-x-6
  p-4 rounded-lg
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-gray-700
">
```

### **3. Testing Your Changes**

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# Preview build
npm run preview
```

### **4. Mobile Testing**

Test your changes on:
- **Chrome DevTools** mobile simulation
- **Actual mobile devices** when possible
- **Different screen sizes** (320px to 1920px)
- **Touch interactions** and gestures

### **5. Accessibility Testing**

Ensure your changes are accessible:
- **Keyboard navigation** works
- **Screen reader** compatibility
- **Color contrast** meets WCAG standards
- **Focus indicators** are visible

## 📋 **Commit Guidelines**

We use [Conventional Commits](https://conventionalcommits.org/) for clear commit messages:

```bash
# Feature
git commit -m "feat: add voice recording functionality"

# Bug fix
git commit -m "fix: resolve mobile menu overlay issue"

# Documentation
git commit -m "docs: update API integration guide"

# Styling
git commit -m "style: improve button hover animations"

# Refactoring
git commit -m "refactor: simplify chat message rendering"

# Performance
git commit -m "perf: optimize bundle size with lazy loading"
```

### **Commit Types**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 📤 **Pull Request Process**

### **1. Before Submitting**

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run lint` and `npm run type-check`)
- [ ] Changes are documented
- [ ] Mobile responsiveness tested
- [ ] Accessibility guidelines followed
- [ ] Performance impact considered

### **2. Pull Request Template**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other: ___________

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested with keyboard navigation
- [ ] Tested with screen reader

## Screenshots
<!-- Add screenshots for UI changes -->

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes
```

### **3. Review Process**

1. **Automated Checks** - CI/CD pipeline runs
2. **Code Review** - Maintainers review code
3. **Testing** - Changes tested in staging
4. **Approval** - Required approvals received
5. **Merge** - Changes merged to main

## 🐛 **Bug Reports**

When reporting bugs, please include:

### **Bug Report Template**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Windows 11, macOS 13, Ubuntu 22.04]
- Browser: [e.g., Chrome 120, Firefox 121, Safari 17]
- Device: [e.g., Desktop, iPhone 15, Samsung Galaxy S23]
- Screen Size: [e.g., 1920x1080, 375x667]

## Screenshots
Add screenshots to help explain the problem

## Additional Context
Any other context about the problem
```

## 💡 **Feature Requests**

### **Feature Request Template**
```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Mockups, examples, or references
```

## 🎨 **Design Contributions**

### **Design Guidelines**
- Follow existing design system
- Maintain consistency across components
- Consider mobile-first approach
- Ensure accessibility compliance
- Test with different themes

### **Design Assets**
- Use Figma for design files
- Export assets as SVG when possible
- Provide multiple resolutions for images
- Include dark mode variants

## 📚 **Documentation Contributions**

### **Documentation Standards**
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Update table of contents
- Test all code examples

### **Types of Documentation**
- **API Documentation** - Service and hook usage
- **Component Documentation** - Props and examples
- **Tutorial Content** - Step-by-step guides
- **Architecture Documentation** - System design

## 🏷️ **Issue Labels**

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation needs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority issues
- `priority: low` - Low priority issues
- `mobile` - Mobile-specific issues
- `accessibility` - Accessibility related
- `performance` - Performance related

## 🚀 **Release Process**

### **Version Numbers**
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality
- **PATCH** version for backward-compatible bug fixes

### **Release Schedule**
- **Major releases** - Quarterly
- **Minor releases** - Monthly
- **Patch releases** - As needed

## 🤝 **Community**

### **Communication Channels**
- **GitHub Discussions** - General discussions
- **Discord Server** - Real-time chat
- **Twitter** - Updates and announcements

### **Recognition**
Contributors are recognized in:
- **README.md** acknowledgments
- **CHANGELOG.md** release notes
- **GitHub Contributors** page

## ❓ **Questions?**

If you have questions:
1. Check existing [documentation](./DEVELOPMENT.md)
2. Search [GitHub issues](https://github.com/yourusername/chatsaas/issues)
3. Ask in [GitHub Discussions](https://github.com/yourusername/chatsaas/discussions)
4. Join our [Discord community](https://discord.gg/chatsaas)

## 🙏 **Thank You**

Thank you for contributing to ChatSaaS! Your contributions help make this project better for everyone.

---

**Happy coding!** 🚀
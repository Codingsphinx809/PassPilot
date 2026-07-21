# Development Guidelines

This document defines the engineering standards for PassPilot.

Every contribution should follow these guidelines.

---

# Philosophy

We optimize for:

- Maintainability
- Readability
- Scalability
- User Experience

Not writing the fewest lines of code.

---

# General Rules

## Keep Components Small

A component should have one responsibility.

If a file grows too large, split it into smaller reusable components.

---

## Avoid Duplicate Code

If logic is reused more than once, consider moving it into:

- hooks/
- utils/
- services/

---

## Type Everything

Use TypeScript interfaces and types wherever practical.

Avoid using `any`.

---

## Folder Organization

Organize by feature instead of file type whenever possible.

Example:

```
features/
    quizzes/
    dashboard/
    onboarding/
```

instead of

```
components/
screens/
helpers/
```

---

# Naming Conventions

Components

```
PascalCase
```

Example

```
QuizCard.tsx
```

Functions

```
camelCase
```

Example

```
calculateConfidence()
```

Constants

```
UPPER_SNAKE_CASE
```

Example

```
MAX_QUESTIONS
```

---

# User Experience

Every screen should answer three questions immediately:

1. Where am I?
2. What should I do next?
3. How close am I to my goal?

---

# Error Handling

Never leave users wondering what happened.

Every error should:

- Explain the problem
- Offer a solution
- Allow recovery

---

# Performance

Optimize only after measuring.

Readable code is preferred over clever code.

---

# Accessibility

All interactive elements should have:

- Accessible labels
- Proper contrast
- Large touch targets
- Screen reader support

---

# Documentation

Complex logic should be documented.

Future developers should understand *why* something exists, not just *what* it does.

---

# Code Reviews

Before merging, ask:

- Is this simpler than before?
- Is it reusable?
- Does it improve the user experience?
- Does it follow our product principles?
- Will this still make sense one year from now?

---

# Final Principle

Code is written for humans first and computers second.

If the next developer can understand it in five minutes, we've done our job.

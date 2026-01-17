import type { Article, Category, Project, SocialLink } from '@/types'

export const categories: Category[] = [
  { id: '1', name: '设计', slug: 'design', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: '开发', slug: 'development', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '3', name: '科技', slug: 'technology', created_at: '2024-01-01T00:00:00.000Z' },
  { id: '4', name: '生活', slug: 'life', created_at: '2024-01-01T00:00:00.000Z' },
]

export const socialLinks: SocialLink[] = [
  { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { name: 'GitHub', url: 'https://github.com', icon: 'github' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { name: 'Email', url: 'mailto:hello@example.com', icon: 'mail' },
]

export const projects: Project[] = [
  {
    id: '1',
    title: 'Design System',
    description: 'A comprehensive design system for modern web applications',
    url: 'https://github.com',
    technologies: ['React', 'TypeScript', 'Figma'],
  },
  {
    id: '2',
    title: 'AI Writing Assistant',
    description: 'An intelligent tool for content creation and editing',
    url: 'https://github.com',
    technologies: ['Python', 'OpenAI', 'FastAPI'],
  },
  {
    id: '3',
    title: 'Portfolio Template',
    description: 'A minimalist portfolio template for creatives',
    url: 'https://github.com',
    technologies: ['Next.js', 'Tailwind CSS', 'shadcn/ui'],
  },
]

export const articles: Article[] = [
  {
    id: '1',
    slug: 'designing-accessible-interfaces',
    title: 'Designing Accessible Interfaces for Everyone',
    excerpt:
      "Accessibility is not just a requirement—it's an opportunity to create better experiences for all users. Let's explore the key principles...",
    content: `# Designing Accessible Interfaces for Everyone

Accessibility is not just a requirement—it's an opportunity to create better experiences for all users.

## Understanding WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide a comprehensive framework for making web content accessible. The four main principles are:

1. **Perceivable**: Information must be presentable in ways users can perceive
2. **Operable**: Interface components must be operable
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must be robust enough to be interpreted reliably

## Color and Contrast

When designing interfaces, ensure sufficient color contrast between text and backgrounds. The WCAG AA standard requires a 4.5:1 contrast ratio for normal text.

\`\`\`css
/* Good contrast example */
.button {
  background: #dc2626;
  color: #ffffff;
  /* Contrast ratio: 5.8:1 ✅ */
}
\`\`\`

## Keyboard Navigation

Every interactive element should be accessible via keyboard. This means:

- Visible focus indicators
- Logical tab order
- Skip links for navigation

## Testing Your Designs

Use these tools to test accessibility:
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

Remember: accessibility benefits everyone, not just those with disabilities.`,
    cover_image:
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
    category_id: '1',
    category: categories[0],
    author_id: '1',
    author: {
      id: '1',
      username: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    created_at: '2025-01-10T00:00:00.000Z',
    updated_at: '2025-01-10T00:00:00.000Z',
    featured: true,
    view_count: 245,
    tags: ['Accessibility', 'UX Design', 'WCAG'],
  },
  {
    id: '2',
    slug: 'modern-react-patterns',
    title: 'Modern React Patterns You Should Know',
    excerpt:
      'Explore the latest React patterns and best practices that will help you build more maintainable and scalable applications...',
    content: `# Modern React Patterns You Should Know

React has evolved significantly over the years. Let's explore modern patterns that improve code quality and developer experience.

## Custom Hooks for Logic Reuse

Custom hooks are the primary way to reuse stateful logic in React:

\`\`\`typescript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
\`\`\`

## Compound Components Pattern

Build flexible APIs using compound components:

\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content goes here</CardContent>
</Card>
\`\`\`

## Server Components

React Server Components enable building apps that span the server and client, reducing the amount of JavaScript sent to the client.`,
    cover_image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    category_id: '2',
    category: categories[1],
    author_id: '1',
    author: {
      id: '1',
      username: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    created_at: '2025-01-08T00:00:00.000Z',
    updated_at: '2025-01-08T00:00:00.000Z',
    featured: true,
    view_count: 189,
    tags: ['React', 'TypeScript', 'Frontend'],
  },
  {
    id: '3',
    slug: 'future-of-ai',
    title: 'The Future of AI in Software Development',
    excerpt:
      "Artificial intelligence is reshaping how we write code. Here's what developers need to know about the AI revolution...",
    content: `# The Future of AI in Software Development

Artificial intelligence is fundamentally changing software development. Let's explore what this means for developers.

## AI-Powered Code Generation

Tools like GitHub Copilot and ChatGPT are becoming indispensable:

- Faster prototyping
- Reduced boilerplate
- Learning new frameworks

## The Developer's Evolving Role

As AI handles more routine tasks, developers focus on:

1. **Architecture**: Designing scalable systems
2. **Problem-solving**: Tackling complex challenges
3. **Code review**: Ensuring quality and security
4. **User experience**: Creating delightful interfaces

## Preparing for the Future

To stay relevant:

- Embrace AI tools as copilots
- Focus on fundamental skills
- Learn system design and architecture
- Understand security and performance

The future is bright for developers who adapt and evolve.`,
    cover_image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    category_id: '3',
    category: categories[2],
    author_id: '1',
    author: {
      id: '1',
      username: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    created_at: '2025-01-05T00:00:00.000Z',
    updated_at: '2025-01-05T00:00:00.000Z',
    featured: false,
    view_count: 156,
    tags: ['AI', 'Future', 'Technology'],
  },
  {
    id: '4',
    slug: 'building-creative-habits',
    title: 'Building Creative Habits That Stick',
    excerpt:
      'Consistency is key to creative growth. Learn how to build habits that enhance your creative output...',
    content: `# Building Creative Habits That Stick

Creativity isn't just inspiration—it's a practice. Here's how to build habits that sustain your creative work.

## Start Small

Begin with manageable commitments:

- 15 minutes of sketching daily
- One blog post per week
- Monthly photo walks

## Track Your Progress

Use journals or apps to track your creative practice. Seeing streaks motivates continued effort.

## Create Rituals

Pair creative work with existing habits:

- Morning coffee + sketching
- Commute + reading design blogs
- Evening walk + photography

## Embrace Imperfection

Done is better than perfect. Every piece of work doesn't need to be a masterpiece—creation itself is the goal.`,
    cover_image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
    category_id: '4',
    category: categories[3],
    author_id: '1',
    author: {
      id: '1',
      username: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    created_at: '2025-01-03T00:00:00.000Z',
    updated_at: '2025-01-03T00:00:00.000Z',
    featured: false,
    view_count: 98,
    tags: ['Creativity', 'Habits', 'Productivity'],
  },
  {
    id: '5',
    slug: 'tailwind-css-techniques',
    title: 'Advanced Tailwind CSS Techniques',
    excerpt:
      'Take your Tailwind CSS skills to the next level with these advanced techniques and patterns...',
    content: `# Advanced Tailwind CSS Techniques

Tailwind CSS is more than utility classes—it's a design system. Let's explore advanced techniques.

## Custom Configuration

Extend Tailwind with your design system:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#dc2626',
        secondary: '#1c1917',
      },
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
      },
    },
  },
}
\`\`\`

## Component Patterns

Build reusable components with @apply:

\`\`\`css
.btn-primary {
  @apply bg-primary text-white px-6 py-3 rounded-lg;
  @apply hover:bg-primary/90 active:scale-95;
  @apply transition-all duration-200;
}
\`\`\`

## Dynamic Variants

Use variant groups for cleaner code:

\`\`\`html
<button class="
  px-4 py-2 rounded-lg font-medium
  hover:shadow-lg active:scale-95
  focus:ring-2 focus:ring-primary
  transition-all
">
  Click me
</button>
\`\`\``,
    cover_image:
      'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop',
    category_id: '2',
    category: categories[1],
    author_id: '1',
    author: {
      id: '1',
      username: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
    featured: true,
    view_count: 312,
    tags: ['Tailwind CSS', 'CSS', 'Frontend'],
  },
  {
    id: '6',
    slug: 'remote-work-balance',
    title: 'Finding Balance While Working Remotely',
    excerpt:
      "Remote work offers freedom but requires discipline. Here's how to maintain work-life balance...",
    content: `# Finding Balance While Working Remotely

Remote work has become the new normal. Here's how to thrive in this environment.

## Create Boundaries

- Dedicated workspace
- Set working hours
- Clear communication with family

## Take Breaks

Use the Pomodoro technique:

- 25 minutes focused work
- 5 minute break
- After 4 cycles, take a longer break

## Stay Connected

- Regular video calls with team
- Virtual coffee chats
- Online communities

## Prioritize Self-Care

- Exercise daily
- Get outside
- Maintain hobbies outside of work

Balance is intentional—design your remote work life with purpose.`,
    cover_image:
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop',
    category_id: '4',
    category: categories[3],
    author_id: '1',
    author: {
      id: '1',
      username: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    created_at: '2024-12-28T00:00:00.000Z',
    updated_at: '2024-12-28T00:00:00.000Z',
    featured: false,
    view_count: 127,
    tags: ['Remote Work', 'Productivity', 'Wellness'],
  },
]

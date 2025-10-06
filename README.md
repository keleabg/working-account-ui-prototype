# Gebeya Dala - Next.js Development Template

A comprehensive Next.js development template optimized for AI agent productivity and modern web development. This template provides a solid foundation with pre-configured tools, components, and development patterns.

## 🚀 Features

- **Next.js 15.3.3** with App Router and React 19
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling with CSS variables
- **shadcn/ui** component library (40+ pre-built components)
- **React Hook Form** with Zod validation
- **Custom hooks** for common functionality
- **Optimized development experience** with custom webpack configuration
- **Production-ready** with standalone output

## 📁 Project Structure

```
/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout with font configuration
│   ├── page.tsx           # Home page component
│   ├── globals.css        # Global styles and Tailwind imports
│   └── error.tsx          # Global error boundary
├── components/            # Reusable React components
│   └── ui/               # shadcn/ui component library (40+ components)
│       ├── button.tsx    # Button component with variants
│       ├── card.tsx      # Card layout components
│       ├── form.tsx      # Form components with validation
│       └── ...           # Additional UI components
├── hooks/                # Custom React hooks
│   ├── use-mobile.ts     # Mobile breakpoint detection hook
│   └── use-localStorage.ts # Local storage state management hook
├── lib/                  # Utility functions and configurations
│   └── utils.ts          # Tailwind class merging and common utilities
├── public/               # Static assets (images, icons, etc.)
├── webpack/              # Custom webpack plugins and configurations
│   └── plugins/          # Error reporting and development tools
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration with custom webpack setup
├── tsconfig.json         # TypeScript configuration with path aliases
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🛠 Technology Stack

### Core Framework

- **Next.js 15.3.3** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Static type checking

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icon library
- **CSS Variables** - Dynamic theming support

### Forms & Validation

- **React Hook Form 7.60** - Performant forms with easy validation
- **Zod 4.0** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation library integrations

### Development Tools

- **ESLint** - Code linting and formatting
- **Custom Webpack Config** - Optimized build process
- **Error Reporting** - Custom webpack plugin for development

### Additional Libraries

- **date-fns** - Modern JavaScript date utility library
- **recharts** - Composable charting library
- **sonner** - Toast notifications
- **next-themes** - Theme switching support
- **class-variance-authority** - Component variant management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone or copy this template
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Setup

Create a `.env.local` file in the root directory for environment variables:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Development Workflow

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Organization Principles

1. **Components**: Place reusable components in `/components`
2. **Pages**: Use App Router in `/app` directory
3. **Utilities**: Common functions go in `/lib`
4. **Hooks**: Custom React hooks in `/hooks`
5. **Types**: TypeScript types co-located with components or in `/types`

### Component Patterns

#### Basic Component Structure

```typescript
interface ComponentProps {
  // Define props with TypeScript
}

export function Component({ ...props }: ComponentProps) {
  // Component logic
  return (
    <div className="...">
      {/* JSX content */}
    </div>
  );
}
```

#### Using shadcn/ui Components

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## 🎨 Styling Guide

### Tailwind CSS Usage

- Use utility classes for styling
- Leverage CSS variables for theming
- Follow mobile-first responsive design

### Component Variants

The template uses `class-variance-authority` for component variants:

```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
```

## 🔧 Configuration

### Path Aliases

The template includes TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { Button } from "../../components/ui/button"
import { Button } from "@/components/ui/button";
```

### Custom Webpack Configuration

The template includes custom webpack configuration for:

- Development caching
- Error reporting
- Module resolution
- Build optimization

## 📚 Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial

### Component Library

- [shadcn/ui Documentation](https://ui.shadcn.com/) - Component library documentation
- [Radix UI](https://www.radix-ui.com/) - Primitive component documentation

### Styling

- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha) - Latest version features

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Other Platforms

The template is configured with `output: "standalone"` for easy deployment on:

- Docker containers
- Node.js servers
- Serverless platforms

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

1. Follow the established code organization principles
2. Use TypeScript for all new code
3. Follow the component patterns outlined above
4. Test your changes thoroughly

## 📄 License

This template is open source and available under the [MIT License](LICENSE).

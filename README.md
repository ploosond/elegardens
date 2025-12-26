# Elegardens

A modern, multilingual e-commerce platform for garden products built with Next.js and Payload CMS.

## Features

- 🌍 **Multilingual Support** - English and German language support
- 🛍️ **Product Catalog** - Browse and search through garden products with detailed information
- 📝 **Content Management** - Blog posts and project showcases
- 👥 **Team Section** - Display team members and company information
- 📧 **Contact Forms** - Newsletter signup and contact submissions
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🔍 **Search Functionality** - Client-side product search with pagination
- 🎥 **Video Integration** - Hero video section on homepage

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3.69
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Linting/Formatting**: Biome

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd elegardens
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

**Required Variables:**

```env
# Payload CMS Configuration
PAYLOAD_SECRET=your-secret-key-here
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/elegardens

# Email Configuration (SMTP)
SMTP_HOST=smtp.example.com
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password

# File Upload (UploadThing)
UPLOADTHING_TOKEN=your-uploadthing-token

# Homepage Video
NEXT_PUBLIC_HOME_VIDEO_URL=https://your-video-url.com/video.mp4
NEXT_PUBLIC_HOME_VIDEO_TITLE=Elegardens
```

**Optional Variables:**

```env
# Contact Form
CONTACT_FORM_RECIPIENT=info@elegardens.com
CONTACT_FORM_SEND_CONFIRMATION=true

# Newsletter
NEWSLETTER_SEND_WELCOME_BACK=true
NEWSLETTER_SEND_CONFIRMATION=true

# Environment
NODE_ENV=development
```

4. Run database migrations:

```bash
pnpm payload migrate
```

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

7. Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome
- `pnpm seed:products` - Seed products data

## Project Structure

```
src/
├── app/
│   ├── (frontend)/     # Public-facing pages
│   │   └── [locale]/   # Localized routes
│   ├── (payload)/      # Payload CMS admin
│   └── api/            # API routes
├── collections/        # Payload CMS collections
├── components/         # React components
├── i18n/              # Internationalization config
└── payload.config.ts  # Payload CMS configuration
```

## Collections

- **Products** - Garden products with images, descriptions, and specifications
- **Blogs** - Blog posts with rich text content
- **Projects** - Project showcases
- **Employees** - Team member information
- **Contact Submissions** - Contact form submissions
- **Newsletter Subscribers** - Newsletter signups
- **Media** - Media library for images and files

## License

This project is private and proprietary.

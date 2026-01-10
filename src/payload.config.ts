import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { About } from './globals/About'
import { AnnouncementBanner } from './globals/AnnouncementBanner'
import { PrivacyPolicy } from './globals/PrivacyPolicy'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Products } from '@/collections/Products'
import { Employees } from '@/collections/Employees'
import { Projects } from '@/collections/Projects'
import { Blogs } from '@/collections//Blogs'
import { ContactSubmissions } from '@/collections/ContactSubmissions'
import { NewsletterSubscribers } from '@/collections/NewsletterSubscribers'
import { Clients } from '@/collections/Clients'
import { Orders } from '@/collections/Orders'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  email: nodemailerAdapter({
    defaultFromAddress: 'info@yoursite.com',
    defaultFromName: 'Elegardens',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  collections: [
    Users,
    Media,
    Products,
    Employees,
    Projects,
    Blogs,
    ContactSubmissions,
    NewsletterSubscribers,
    Clients,
    Orders,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  globals: [AnnouncementBanner, About, PrivacyPolicy],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
})

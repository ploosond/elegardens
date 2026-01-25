# Elegardens

A modern, multilingual e-commerce platform for garden products built with Next.js and Payload CMS.

## Features

- 🌍 **Multilingual Support** - English and German language support
- 🛍️ **Product Catalog** - Browse and search through garden products with detailed information
- 📝 **Blog & Content** - Blog posts and project showcases
- 👥 **Team Section** - Display team members with profile information
- 📧 **Contact & Newsletter** - Contact forms and newsletter subscriptions
- 🔐 **Client Authentication** - Secure client login and dashboard
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and Biome formatting
- 🔍 **Search Functionality** - Client-side product search with pagination
- 🎥 **Video Integration** - Hero video section on homepage
- 📦 **Media Management** - UploadThing CDN for images and files
- ✉️ **Email Service** - Resend for reliable email delivery

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3.69
- **Database**: PostgreSQL 17
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Linting/Formatting**: Biome
- **Email**: Resend API
- **Storage**: UploadThing CDN
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 24+ (for local dev)
- pnpm (or npm/yarn)
- Docker & Docker Compose (for database)

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd elegardens
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Set up environment variables:**
   Create a `.env` file in the root directory. Use the template below:

```env
# Database
POSTGRES_PASSWORD=your_secure_password

# Database Connection (Docker will use this to connect)
DATABASE_URL=postgresql://payload:your_secure_password@localhost:5432/elegardens

# Payload CMS
PAYLOAD_SECRET=your_secure_payload_secret_here

# Public URLs
SERVER_URL=http://localhost:3000
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# File Storage (UploadThing)
UPLOADTHING_TOKEN=your_uploadthing_token

# Contact/Order Emails
ORDERS_EMAIL_RECIPIENT=orders@yourdomain.com
CONTACT_FORM_RECIPIENT=contact@yourdomain.com
NEWSLETTER_RECIPIENT_EMAIL=newsletter@yourdomain.com

# Video URL
NEXT_PUBLIC_HOME_VIDEO_URL=https://your-video-cdn.com/video.mp4
```

4. **Start Postgres in Docker (separate terminal):**

```bash
docker-compose -f docker-compose.dev.yml up postgres -d
```

5. **Run the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

### Seed Data (First Time Setup)

If this is your first time setting up the project, populate the database with initial data:

```bash
# Seed products
pnpm seed:products

# Seed employees
pnpm seed:employees

# Seed pots
pnpm seed:pots
```

You can also seed data directly through the Payload admin panel at `/admin/collections/products`, `/admin/collections/employees`, etc.

## Available Scripts

| Script                | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `pnpm dev`            | Start local Next.js dev server (requires Postgres running in Docker) |
| `pnpm build`          | Build for production                                                 |
| `pnpm start`          | Start production server                                              |
| `pnpm lint`           | Run Biome linter                                                     |
| `pnpm format`         | Format code with Biome                                               |
| `pnpm seed:products`  | Seed sample products data                                            |
| `pnpm seed:employees` | Seed team member data                                                |
| `pnpm seed:pots`      | Seed product containers/pots data                                    |

## API Endpoints

### Authentication (Client)

#### Login

```bash
POST /api/client/login
Content-Type: application/json

{
  "email": "client@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "email": "client@example.com",
    "companyName": "...",
    "contactPerson": "..."
  },
  "token": "..."
}
```

#### Logout

```bash
POST /api/client/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Current User

```bash
GET /api/client/me

Response:
{
  "user": { /* client object */ }
}
```

### Contact Form

#### Submit Contact

```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "..."
}
```

### Admin API (Payload)

The Payload CMS REST API is available at `/api/*`. Examples:

```bash
# Get all products
GET /api/products

# Get single product
GET /api/products/[id]

# Create product (admin only)
POST /api/products
Content-Type: application/json
Authorization: Bearer [token]

{
  "name": "Product Name",
  "description": "...",
  "price": 29.99
}
```

Full Payload API documentation: [http://localhost:3000/admin/api](http://localhost:3000/admin/api)

## Production Deployment

### Prerequisites

- VPS with Docker and Docker Compose installed
- GitHub repository access
- Domain with DNS configured
- Production environment variables

### Deployment Steps

1. **SSH into VPS:**

```bash
ssh user@your-vps-ip
```

2. **Clone repository:**

```bash
git clone <repository-url>
cd elegardens
git checkout main
```

3. **Create production `.env`:**

```bash
nano .env
```

Add the following (replace with your actual values):

```env
# Database
POSTGRES_PASSWORD=your_very_secure_password_here

# Database Connection (same password as above, but uses 'postgres' Docker hostname)
DATABASE_URL=postgresql://payload:your_very_secure_password_here@postgres:5432/elegardens

# Payload CMS
PAYLOAD_SECRET=your_secure_payload_secret_here

# Public URLs (use your actual domain)
SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=https://elegardens.com
NEXT_PUBLIC_PAYLOAD_URL=https://elegardens.com

# Email (Resend - get from Resend dashboard)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@elegardens.com

# File Storage (UploadThing - get from UploadThing dashboard)
UPLOADTHING_TOKEN=eyJhcGlLZXk...

# Contact/Order Emails
ORDERS_EMAIL_RECIPIENT=orders@elegardens.com
CONTACT_FORM_RECIPIENT=contact@elegardens.com
NEWSLETTER_RECIPIENT_EMAIL=newsletter@elegardens.com

# Video URL (Cloudinary or your CDN)
NEXT_PUBLIC_HOME_VIDEO_URL=https://res.cloudinary.com/...
```

4. **Start production containers:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

5. **Verify containers are running:**

```bash
docker ps
```

You should see `elegardens-postgres-1` and `elegardens-payload-1` running.

6. **Check logs for any errors:**

```bash
docker logs elegardens-payload-1
docker logs elegardens-postgres-1
```

7. **Access your site:**

- Frontend: `http://your-vps-ip:3000`
- Admin: `http://your-vps-ip:3000/admin`

### Domain & SSL Setup

Once your VPS is running, configure a custom domain with HTTPS:

#### 1. Configure DNS Records

In your domain registrar's DNS management panel, add:

- **A Record**: `@` → `your-vps-ip` (e.g., `165.232.121.96`)
- **CNAME Record**: `www` → `yourdomain.com`

Wait for DNS propagation (typically 5-60 minutes). Verify with:

```bash
dig yourdomain.com
dig www.yourdomain.com
```

#### 2. Configure VPS Firewall

Allow HTTP and HTTPS traffic:

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw status
```

Expected output should show ports 22, 80, 443 (and optionally 3000).

#### 3. Install Nginx

```bash
apt update && apt install -y nginx
```

#### 4. Create Nginx Configuration

Create a new site configuration:

```bash
nano /etc/nginx/sites-available/yourdomain
```

Add the following configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit (Ctrl+X, Y, Enter).

#### 5. Enable the Site

```bash
ln -s /etc/nginx/sites-available/yourdomain /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

Test by visiting `http://yourdomain.com` in your browser.

#### 6. Install SSL Certificate (Let's Encrypt)

Install Certbot:

```bash
apt install -y certbot python3-certbot-nginx
```

Obtain and configure SSL certificate:

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:

- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

Certbot will automatically update your Nginx configuration and obtain a free SSL certificate.

#### 7. Update Environment Variables

Edit your production `.env` file to use HTTPS:

```bash
nano /root/elegardens/.env
```

Update these variables:

```env
SERVER_URL=https://yourdomain.com
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
NEXT_PUBLIC_PAYLOAD_URL=https://yourdomain.com
```

#### 8. Rebuild Docker Containers

Apply the environment changes:

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 9. Verify Setup

Visit your site:

- Frontend: `https://yourdomain.com`
- Admin: `https://yourdomain.com/admin`

Check SSL certificate status:

```bash
certbot certificates
```

#### SSL Certificate Auto-Renewal

Let's Encrypt certificates expire after 90 days. Certbot automatically sets up a renewal cron job. Verify it:

```bash
systemctl status certbot.timer
```

Test renewal (dry run):

```bash
certbot renew --dry-run
```

### Production Maintenance

#### View running containers

```bash
docker ps
```

#### Check logs

```bash
docker logs elegardens-payload-1
docker logs elegardens-postgres-1

# Real-time logs
docker logs -f elegardens-payload-1
```

#### Restart containers

```bash
docker-compose -f docker-compose.prod.yml restart
docker-compose -f docker-compose.prod.yml restart elegardens-payload-1
```

#### Stop all containers

```bash
docker-compose -f docker-compose.prod.yml down
```

#### Pull latest code and redeploy

```bash
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

#### Access database directly (Postgres)

```bash
docker exec -it elegardens-postgres-1 psql -U payload -d elegardens
```

#### Seed Data in Docker

To populate your database with initial data or refresh it in the production Docker environment:

**1. Rebuild the Docker Image:**
You must rebuild the Docker image whenever `Dockerfile` or `package.json` changes.
```bash
docker-compose -f docker-compose.prod.yml build
# Or rebuild and restart all services
docker-compose -f docker-compose.prod.yml up -d --build
```

**2. Run Migrations (if fresh setup):**
For a fresh database setup, run Payload migrations first. This ensures your database schema is up-to-date.
```bash
docker exec -it elegardens-payload-1 pnpm payload migrate
```

**3. Run Seed Commands:**
Use `docker exec` to run the seed scripts inside the running `payload` container.

To seed all data:
```bash
docker exec -it elegardens-payload-1 pnpm seed:all
```

To seed individual collections (e.g., employees, pots, products, globals):
```bash
docker exec -it elegardens-payload-1 pnpm seed:employees
docker exec -it elegardens-payload-1 pnpm seed:pots
docker exec -it elegardens-payload-1 pnpm seed:products
docker exec -it elegardens-payload-1 pnpm seed:globals
```

To clear existing data for specific collections before seeding, add the `-- --clear` flag:
```bash
docker exec -it elegardens-payload-1 pnpm seed:all -- --clear
```

**Notes:**
- Ensure your `.env` file within the VPS has `DATABASE_URL` correctly configured to point to the `postgres` service (e.g., `postgresql://payload:your_secure_password_here@postgres:5432/elegardens`).
- The `/app/media` directory inside the container is now configured as a Docker volume (`media_data`) in `docker-compose.prod.yml` to ensure persistence of uploaded files across container restarts.

#### Backup database

```bash
docker exec elegardens-postgres-1 pg_dump -U payload elegardens > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Restore database from backup

```bash
docker exec -i elegardens-postgres-1 psql -U payload elegardens < backup.sql
```

#### View Docker volumes

```bash
docker volume ls
docker volume inspect elegardens_pgdata_prod
```

#### Clean up unused Docker resources

```bash
docker system prune -a --volumes
```

## Project Structure

```
src/
├── app/
│   ├── (frontend)/              # Public-facing pages
│   │   └── [locale]/            # Localized routes (en, de)
│   │       ├── page.tsx         # Homepage
│   │       ├── about/           # About page
│   │       ├── products/        # Product listing
│   │       ├── client/          # Client dashboard & login
│   │       ├── contact/         # Contact form
│   │       └── ...
│   ├── (payload)/               # Payload CMS admin panel
│   │   └── api/[...slug]/       # Payload API routes
│   └── api/                     # Custom API routes
│       ├── client/              # Client auth endpoints (login, logout, me)
│       ├── contact/             # Contact form submission
│       └── newsletter/          # Newsletter endpoints
├── collections/                 # Payload CMS collection configs
│   ├── Products.ts
│   ├── Clients.ts
│   ├── Users.ts
│   ├── Employees.ts
│   └── ...
├── components/
│   ├── cards/                   # Card components (ProductCard, TeamCard, etc)
│   ├── ui/                      # UI components (Button, Input, Header, Footer)
│   └── client/                  # Client-side components
├── contexts/                    # React contexts (CartContext)
├── i18n/                        # Internationalization config
├── lib/
│   ├── auth-client.ts          # Client auth helper
│   └── email/                  # Email templates and utilities
├── payload.config.ts            # Payload CMS configuration
└── middleware.ts                # Next.js middleware (localization, auth)

data/
├── employees.json              # Seed data
├── products.json
└── pots.json

scripts/
├── seed-employees.ts           # Seed scripts
├── seed-products.ts
└── seed-pots.ts
```

## Collections

| Collection                 | Purpose                 | Fields                                            |
| -------------------------- | ----------------------- | ------------------------------------------------- |
| **Products**               | Garden products catalog | name, description, price, images, category, stock |
| **Clients**                | B2B client accounts     | clientId, companyName, email, phone, status       |
| **Users**                  | Admin users             | email, password (Payload auth)                    |
| **Employees**              | Team members            | name, position, image, bio, email                 |
| **Orders**                 | Customer orders         | clientId, items, total, email, status             |
| **Blogs**                  | Blog posts              | title, slug, content, author, publishedAt         |
| **Projects**               | Project showcases       | name, description, image, link                    |
| **Contact Submissions**    | Contact form data       | name, email, message, submittedAt                 |
| **Newsletter Subscribers** | Email subscribers       | email, subscribedAt                               |
| **Media**                  | Images/files            | uploaded via UploadThing                          |

## Configuration

### Environment-Specific Settings

**Development** (`.env`):

- Uses `localhost:5432` for Postgres
- `pnpm dev` runs local Next.js server
- Resend API key (sandbox by default)

**Production** (`VPS .env`):

- Uses Docker container hostname `postgres:5432`
- Full app runs in Docker containers
- Resend API key (production)
- Real domain URLs

### Key Configuration Files

- **next.config.ts** - Next.js build & image optimization
- **payload.config.ts** - Payload CMS, email (Resend), storage (UploadThing), database
- **tsconfig.json** - TypeScript configuration
- **biome.json** - Code formatting and linting rules
- **docker-compose.dev.yml** - Development Docker setup (Postgres only)
- **docker-compose.prod.yml** - Production Docker setup (full app + Postgres)

## License

This project is private and proprietary.

## Development Notes

### Local Development Workflow

1. **Start Postgres (one-time per session):**

   ```bash
   docker-compose -f docker-compose.dev.yml up postgres -d
   ```

2. **In a new terminal, start Next.js dev server:**

   ```bash
   pnpm dev
   ```

3. **Access the app:**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

4. **When done, stop Postgres:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Database Notes

- **Dev**: Postgres runs in Docker, data persists in `elegardens_pgdata` volume
- **Prod**: Postgres runs in Docker, data persists in `elegardens_pgdata_prod` volume
- Both use `postgresql://payload:PASSWORD@hostname:5432/elegardens` connection string
- If connection fails, ensure `DATABASE_URL` matches `POSTGRES_PASSWORD`

### Image & CDN Notes

- **Dev**: May see intermittent timeouts fetching from UploadThing CDN (local network → Cloudflare)
- **Prod**: Monitor CDN connectivity on VPS; consider IPv4-first DNS if issues persist
- Images eventually load after retries in browser

### Authentication Flow

1. User submits credentials on `/client/login`
2. Frontend calls `/api/client/login` (our proxy)
3. Proxy validates input, then calls Payload's `/api/clients/login`
4. Session cookie is set, user redirected to `/client/dashboard`
5. Dashboard fetches `/api/client/me` to check auth state

### Email Delivery

- **Service**: Resend API (replaces Nodemailer SMTP)
- **Setup**: Configure in `payload.config.ts`
- **Sandbox**: Default Resend API key limits senders; domain verification required for production
- **Emails sent**: Order confirmations, contact form replies, newsletter welcomes

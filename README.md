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
- 📦 **Media Management** - Local file storage with Docker volumes (persistent storage)
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
- **Storage**: Local file storage (Docker volumes)
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

# Public URLs (for VPS IP-only access, use your IP. For domain-based, use your domain)
SERVER_URL=http://localhost:3000
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000

# Cookie Security (set to false for HTTP-only access without domain)
# COOKIE_SECURE=false

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

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

## VPS Docker Deployment

### Prerequisites

- VPS with Docker and Docker Compose installed
- SSH access to your VPS
- GitHub repository access (optional, can manually upload files)
- For domain+SSL: domain with DNS access, for IP-only: just your VPS IP

### Step 1: SSH into Your VPS

```bash
ssh root@YOUR_VPS_IP
# or if using a specific user
ssh user@YOUR_VPS_IP
```

### Step 2: Install Docker & Docker Compose (if not already installed)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Clone Repository

```bash
cd /home
git clone <your-repository-url> elegardens
cd elegardens
```

### Step 4: Create Production `.env` File

**For IP-only access (no domain ready yet):**

```bash
nano .env
```

Add these environment variables:

```env
# Node environment
NODE_ENV=production

# Database (use strong password!)
POSTGRES_PASSWORD=change_me_to_strong_password

# Database Connection (uses Docker hostname 'postgres', not localhost)
DATABASE_URL=postgresql://payload:change_me_to_strong_password@postgres:5432/elegardens

# Payload CMS (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
PAYLOAD_SECRET=your_generated_secret_key_here

# Server URLs (your VPS IP:3000 for both)
SERVER_URL=http://YOUR_VPS_IP:3000
NEXT_PUBLIC_PAYLOAD_URL=http://YOUR_VPS_IP:3000

# Cookie Security (must be false for HTTP-only IP access)
COOKIE_SECURE=false

# Email (Resend API)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Contact/Order Emails
ORDERS_EMAIL_RECIPIENT=orders@yourdomain.com
CONTACT_FORM_RECIPIENT=contact@yourdomain.com
NEWSLETTER_RECIPIENT_EMAIL=newsletter@yourdomain.com

# Video URL (optional, can set to empty string)
NEXT_PUBLIC_HOME_VIDEO_URL=
```

**Important**: Replace `YOUR_VPS_IP` with your actual VPS IP address!

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### Step 5: Start Docker Containers

```bash
# Build and start the containers in background
docker-compose -f docker-compose.prod.yml up -d

# Check if containers are running
docker ps

# You should see two containers: elegardens-postgres-1 and elegardens-payload-1
```

### Step 6: Verify the Setup

```bash
# Check application logs for any errors
docker logs elegardens-payload-1 -f

# You should see "Ready - started server on..." when ready (Ctrl+C to exit logs)

# Check database connection
docker logs elegardens-postgres-1 | tail -20
```

### Step 7: Access Your Site

Open your browser and navigate to:

```
http://YOUR_VPS_IP:3000/en
```

- **Frontend**: `http://YOUR_VPS_IP:3000/en`
- **Admin Panel**: `http://YOUR_VPS_IP:3000/admin`
- **German Site**: `http://YOUR_VPS_IP:3000/de`

### Step 8: Seed Initial Data (Optional)

If you want to populate sample data:

```bash
# Access the running container
docker exec -it elegardens-payload-1 sh

# Inside container, run seed commands
pnpm seed:products
pnpm seed:employees
pnpm seed:pots

# Exit container
exit
```

### Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Stop containers
docker-compose -f docker-compose.prod.yml stop

# Start containers
docker-compose -f docker-compose.prod.yml start

# Restart containers
docker-compose -f docker-compose.prod.yml restart

# View logs
docker logs elegardens-payload-1 -f

# Remove containers (caution: deletes everything except volumes!)
docker-compose -f docker-compose.prod.yml down

# View volumes (persistent storage)
docker volume ls | grep elegardens
```

### Media Storage (Local Files)

Your media files are stored in a Docker volume named `media_data`:

```bash
# List volumes
docker volume ls

# To backup media files:
docker run --rm -v elegardens_media_data:/data -v /tmp:/backup \
  alpine tar czf /backup/media-backup.tar.gz -C /data .

# Your media files are automatically persistent even if containers restart!
```

### Troubleshooting

**Port 3000 already in use:**

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Stop that process or use a different port in docker-compose.prod.yml
```

**Database connection error:**

```bash
# Check database logs
docker logs elegardens-postgres-1

# Verify password matches in .env
# DATABASE_URL password must match POSTGRES_PASSWORD
```

**Media files not persisting:**

```bash
# Verify the media volume is mounted
docker inspect elegardens-payload-1 | grep -A 10 Mounts

# Should show: "Source": "elegardens_media_data"
```

### Domain & SSL Setup

Once your VPS with IP access is running and you're ready to add your domain:

#### Step 1: Configure DNS Records

In your domain registrar's DNS management panel, add:

- **A Record**: `@` → `your-vps-ip` (e.g., `165.232.121.96`)
- **CNAME Record**: `www` → `yourdomain.com`

Wait for DNS propagation (typically 5-60 minutes). Verify with:

```bash
dig yourdomain.com
dig www.yourdomain.com
```

#### Step 2: Configure VPS Firewall

Allow HTTP and HTTPS traffic:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

Expected output should show ports 22, 80, 443 (and 3000).

#### Step 3: Install Nginx

```bash
sudo apt update && sudo apt install -y nginx
```

#### Step 4: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/yourdomain
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

#### Step 5: Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/yourdomain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Test by visiting `http://yourdomain.com` in your browser.

#### Step 6: Install SSL Certificate with Certbot

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain and configure SSL certificate:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:

- Enter your email address
- Agree to terms of service
- Choose to redirect HTTP to HTTPS (recommended)

#### Step 7: Update Environment Variables

Edit your `.env` file:

```bash
sudo nano /home/elegardens/.env
```

Update these variables:

```env
SERVER_URL=https://yourdomain.com
NEXT_PUBLIC_PAYLOAD_URL=https://yourdomain.com

# NOW set this to true since we're using HTTPS
COOKIE_SECURE=true
```

#### Step 8: Restart Containers

```bash
cd /home/elegardens
docker-compose -f docker-compose.prod.yml restart
```

#### Step 9: Verify Everything Works

```bash
# Check Nginx is running
sudo systemctl status nginx

# Check containers still running
docker ps

# Check for any errors
docker logs elegardens-payload-1 -f
```

Your site should now be accessible at:

- `https://yourdomain.com/en` ✅ (HTTPS)
- `http://yourdomain.com/en` → redirects to HTTPS ✅
- `http://YOUR_VPS_IP:3000/en` ✅ (still works on IP, no domain needed)

### SSL Certificate Auto-Renewal

Certbot automatically renews certificates. To test the renewal process:

```bash
sudo certbot renew --dry-run
```

If everything looks good, you're all set! Certbot will automatically renew your certificate before it expires.

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

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_availability" AS ENUM('available', 'out-of-stock');
  CREATE TYPE "public"."enum_products_light_en" AS ENUM('full-sun', 'partial-sun', 'partial-shade', 'full-shade');
  CREATE TYPE "public"."enum_products_light_de" AS ENUM('full-sun', 'partial-sun', 'partial-shade', 'full-shade');
  CREATE TYPE "public"."enum_pots_availability" AS ENUM('available', 'out-of-stock');
  CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'read', 'replied', 'archived');
  CREATE TYPE "public"."enum_newsletter_subscribers_status" AS ENUM('active', 'unsubscribed', 'bounced');
  CREATE TYPE "public"."enum_clients_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'confirmed', 'processing', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_orders_locale" AS ENUM('en', 'de');
  CREATE TYPE "public"."enum_announcement_banner_font_weight" AS ENUM('semibold', 'bold', 'extrabold');
  CREATE TYPE "public"."enum_announcement_banner_speed" AS ENUM('slow', 'medium', 'fast');
  CREATE TYPE "public"."enum__announcement_banner_v_version_font_weight" AS ENUM('semibold', 'bold', 'extrabold');
  CREATE TYPE "public"."enum__announcement_banner_v_version_speed" AS ENUM('slow', 'medium', 'fast');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"common_name" varchar NOT NULL,
  	"availability" "enum_products_availability" DEFAULT 'available' NOT NULL,
  	"quantity" numeric,
  	"description_en" varchar NOT NULL,
  	"description_de" varchar NOT NULL,
  	"height" varchar NOT NULL,
  	"diameter" varchar NOT NULL,
  	"hardiness" varchar NOT NULL,
  	"light_en" "enum_products_light_en" NOT NULL,
  	"light_de" "enum_products_light_de" NOT NULL,
  	"color" varchar DEFAULT '#6a844a',
  	"metatitle_en" varchar,
  	"metatitle_de" varchar,
  	"metadescription_en" varchar,
  	"metadescription_de" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "pots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"pot_id" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"size" varchar,
  	"availability" "enum_pots_availability" DEFAULT 'available' NOT NULL,
  	"quantity" numeric,
  	"image_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "employees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar,
  	"telephone" varchar,
  	"role_en" varchar NOT NULL,
  	"role_de" varchar NOT NULL,
  	"department_en" varchar,
  	"department_de" varchar,
  	"profile_picture_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_blocks_text_block_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_en" varchar NOT NULL,
  	"text_de" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle_en" varchar,
  	"subtitle_de" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption_en" varchar,
  	"caption_de" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"position" numeric DEFAULT 0,
  	"client" varchar NOT NULL,
  	"title_en" varchar NOT NULL,
  	"title_de" varchar NOT NULL,
  	"tagline_en" varchar,
  	"tagline_de" varchar,
  	"category_en" varchar NOT NULL,
  	"category_de" varchar NOT NULL,
  	"image_id" integer,
  	"metatitle_en" varchar,
  	"metatitle_de" varchar,
  	"metadescription_en" varchar,
  	"metadescription_de" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blogs_blocks_text_block_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_en" varchar NOT NULL,
  	"text_de" varchar NOT NULL
  );
  
  CREATE TABLE "blogs_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle_en" varchar,
  	"subtitle_de" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption_en" varchar,
  	"caption_de" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"position" numeric DEFAULT 0,
  	"title_en" varchar NOT NULL,
  	"title_de" varchar NOT NULL,
  	"summary_en" varchar,
  	"summary_de" varchar,
  	"author" varchar,
  	"published_date" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"metatitle_en" varchar,
  	"metatitle_de" varchar,
  	"metadescription_en" varchar,
  	"metadescription_de" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"firstname" varchar NOT NULL,
  	"lastname" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_contact_submissions_status" DEFAULT 'new',
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"consent" boolean DEFAULT true,
  	"status" "enum_newsletter_subscribers_status" DEFAULT 'active',
  	"subscribed_at" timestamp(3) with time zone,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clients_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" varchar NOT NULL,
  	"company_name" varchar NOT NULL,
  	"contact_person" varchar,
  	"phone" varchar,
  	"address" varchar NOT NULL,
  	"status" "enum_clients_status" DEFAULT 'active' NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" varchar NOT NULL,
  	"item_name" varchar NOT NULL,
  	"quantity" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"client_id" integer NOT NULL,
  	"company_name" varchar NOT NULL,
  	"order_date" varchar,
  	"delivery_date" varchar NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"notes" varchar,
  	"admin_notes" varchar,
  	"locale" "enum_orders_locale" DEFAULT 'en',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"products_id" integer,
  	"pots_id" integer,
  	"employees_id" integer,
  	"projects_id" integer,
  	"blogs_id" integer,
  	"contact_submissions_id" integer,
  	"newsletter_subscribers_id" integer,
  	"clients_id" integer,
  	"orders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"clients_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "announcement_banner_announcements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_en" varchar,
  	"text_de" varchar
  );
  
  CREATE TABLE "announcement_banner" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"background_color" varchar DEFAULT '#0b7a43',
  	"text_color" varchar DEFAULT '#ffffff',
  	"font_weight" "enum_announcement_banner_font_weight" DEFAULT 'bold',
  	"show_on_desktop" boolean DEFAULT true,
  	"show_on_mobile" boolean DEFAULT true,
  	"speed" "enum_announcement_banner_speed" DEFAULT 'medium',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_announcement_banner_v_version_announcements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text_en" varchar,
  	"text_de" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_announcement_banner_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT false,
  	"version_background_color" varchar DEFAULT '#0b7a43',
  	"version_text_color" varchar DEFAULT '#ffffff',
  	"version_font_weight" "enum__announcement_banner_v_version_font_weight" DEFAULT 'bold',
  	"version_show_on_desktop" boolean DEFAULT true,
  	"version_show_on_mobile" boolean DEFAULT true,
  	"version_speed" "enum__announcement_banner_v_version_speed" DEFAULT 'medium',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_en" varchar NOT NULL,
  	"title_de" varchar NOT NULL,
  	"subtitle1_en" varchar,
  	"subtitle1_de" varchar,
  	"desc1_en" varchar,
  	"desc1_de" varchar,
  	"subtitle2_en" varchar,
  	"subtitle2_de" varchar,
  	"desc2_en" varchar,
  	"desc2_de" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"roots_title_en" varchar NOT NULL,
  	"roots_title_de" varchar NOT NULL,
  	"roots_intro_en" varchar NOT NULL,
  	"roots_intro_de" varchar NOT NULL,
  	"roots_signature_en" varchar,
  	"roots_signature_de" varchar,
  	"milestones_title_en" varchar,
  	"milestones_title_de" varchar,
  	"our_story_title_en" varchar,
  	"our_story_title_de" varchar,
  	"ceo_title_en" varchar,
  	"ceo_title_de" varchar,
  	"ceo_desc_en" varchar,
  	"ceo_desc_de" varchar,
  	"ceo_image_id" integer,
  	"mission_title_en" varchar,
  	"mission_title_de" varchar,
  	"mission_desc_en" varchar,
  	"mission_desc_de" varchar,
  	"vision_title_en" varchar,
  	"vision_title_de" varchar,
  	"vision_desc_en" varchar,
  	"vision_desc_de" varchar,
  	"values_title_en" varchar,
  	"values_title_de" varchar,
  	"values_desc_en" varchar,
  	"values_desc_de" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "privacy_policy_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_en" varchar NOT NULL,
  	"title_de" varchar NOT NULL,
  	"content_en" jsonb NOT NULL,
  	"content_de" jsonb NOT NULL
  );
  
  CREATE TABLE "privacy_policy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pots" ADD CONSTRAINT "pots_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "employees" ADD CONSTRAINT "employees_profile_picture_id_media_id_fk" FOREIGN KEY ("profile_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_text_block_paragraphs" ADD CONSTRAINT "projects_blocks_text_block_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_text_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_text_block" ADD CONSTRAINT "projects_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_image_block" ADD CONSTRAINT "projects_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_image_block" ADD CONSTRAINT "projects_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_text_block_paragraphs" ADD CONSTRAINT "blogs_blocks_text_block_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_text_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_text_block" ADD CONSTRAINT "blogs_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_image_block" ADD CONSTRAINT "blogs_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_image_block" ADD CONSTRAINT "blogs_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients_sessions" ADD CONSTRAINT "clients_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pots_fk" FOREIGN KEY ("pots_id") REFERENCES "public"."pots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_employees_fk" FOREIGN KEY ("employees_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk" FOREIGN KEY ("newsletter_subscribers_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcement_banner_announcements" ADD CONSTRAINT "announcement_banner_announcements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcement_banner"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcement_banner_v_version_announcements" ADD CONSTRAINT "_announcement_banner_v_version_announcements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcement_banner_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_milestones" ADD CONSTRAINT "about_milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_milestones" ADD CONSTRAINT "about_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_ceo_image_id_media_id_fk" FOREIGN KEY ("ceo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "privacy_policy_sections" ADD CONSTRAINT "privacy_policy_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_policy"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "products_product_id_idx" ON "products" USING btree ("product_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "pots_pot_id_idx" ON "pots" USING btree ("pot_id");
  CREATE INDEX "pots_image_idx" ON "pots" USING btree ("image_id");
  CREATE INDEX "pots_updated_at_idx" ON "pots" USING btree ("updated_at");
  CREATE INDEX "pots_created_at_idx" ON "pots" USING btree ("created_at");
  CREATE INDEX "employees_profile_picture_idx" ON "employees" USING btree ("profile_picture_id");
  CREATE INDEX "employees_updated_at_idx" ON "employees" USING btree ("updated_at");
  CREATE INDEX "employees_created_at_idx" ON "employees" USING btree ("created_at");
  CREATE INDEX "projects_blocks_text_block_paragraphs_order_idx" ON "projects_blocks_text_block_paragraphs" USING btree ("_order");
  CREATE INDEX "projects_blocks_text_block_paragraphs_parent_id_idx" ON "projects_blocks_text_block_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_text_block_order_idx" ON "projects_blocks_text_block" USING btree ("_order");
  CREATE INDEX "projects_blocks_text_block_parent_id_idx" ON "projects_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_text_block_path_idx" ON "projects_blocks_text_block" USING btree ("_path");
  CREATE INDEX "projects_blocks_image_block_order_idx" ON "projects_blocks_image_block" USING btree ("_order");
  CREATE INDEX "projects_blocks_image_block_parent_id_idx" ON "projects_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_image_block_path_idx" ON "projects_blocks_image_block" USING btree ("_path");
  CREATE INDEX "projects_blocks_image_block_image_idx" ON "projects_blocks_image_block" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "blogs_blocks_text_block_paragraphs_order_idx" ON "blogs_blocks_text_block_paragraphs" USING btree ("_order");
  CREATE INDEX "blogs_blocks_text_block_paragraphs_parent_id_idx" ON "blogs_blocks_text_block_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_text_block_order_idx" ON "blogs_blocks_text_block" USING btree ("_order");
  CREATE INDEX "blogs_blocks_text_block_parent_id_idx" ON "blogs_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_text_block_path_idx" ON "blogs_blocks_text_block" USING btree ("_path");
  CREATE INDEX "blogs_blocks_image_block_order_idx" ON "blogs_blocks_image_block" USING btree ("_order");
  CREATE INDEX "blogs_blocks_image_block_parent_id_idx" ON "blogs_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_image_block_path_idx" ON "blogs_blocks_image_block" USING btree ("_path");
  CREATE INDEX "blogs_blocks_image_block_image_idx" ON "blogs_blocks_image_block" USING btree ("image_id");
  CREATE UNIQUE INDEX "blogs_slug_idx" ON "blogs" USING btree ("slug");
  CREATE INDEX "blogs_cover_image_idx" ON "blogs" USING btree ("cover_image_id");
  CREATE INDEX "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
  CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");
  CREATE INDEX "newsletter_subscribers_updated_at_idx" ON "newsletter_subscribers" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscribers_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");
  CREATE INDEX "clients_sessions_order_idx" ON "clients_sessions" USING btree ("_order");
  CREATE INDEX "clients_sessions_parent_id_idx" ON "clients_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "clients_client_id_idx" ON "clients" USING btree ("client_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE UNIQUE INDEX "clients_email_idx" ON "clients" USING btree ("email");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_client_idx" ON "orders" USING btree ("client_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_pots_id_idx" ON "payload_locked_documents_rels" USING btree ("pots_id");
  CREATE INDEX "payload_locked_documents_rels_employees_id_idx" ON "payload_locked_documents_rels" USING btree ("employees_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_clients_id_idx" ON "payload_preferences_rels" USING btree ("clients_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "announcement_banner_announcements_order_idx" ON "announcement_banner_announcements" USING btree ("_order");
  CREATE INDEX "announcement_banner_announcements_parent_id_idx" ON "announcement_banner_announcements" USING btree ("_parent_id");
  CREATE INDEX "_announcement_banner_v_version_announcements_order_idx" ON "_announcement_banner_v_version_announcements" USING btree ("_order");
  CREATE INDEX "_announcement_banner_v_version_announcements_parent_id_idx" ON "_announcement_banner_v_version_announcements" USING btree ("_parent_id");
  CREATE INDEX "_announcement_banner_v_created_at_idx" ON "_announcement_banner_v" USING btree ("created_at");
  CREATE INDEX "_announcement_banner_v_updated_at_idx" ON "_announcement_banner_v" USING btree ("updated_at");
  CREATE INDEX "about_milestones_order_idx" ON "about_milestones" USING btree ("_order");
  CREATE INDEX "about_milestones_parent_id_idx" ON "about_milestones" USING btree ("_parent_id");
  CREATE INDEX "about_milestones_image_idx" ON "about_milestones" USING btree ("image_id");
  CREATE INDEX "about_ceo_image_idx" ON "about" USING btree ("ceo_image_id");
  CREATE INDEX "privacy_policy_sections_order_idx" ON "privacy_policy_sections" USING btree ("_order");
  CREATE INDEX "privacy_policy_sections_parent_id_idx" ON "privacy_policy_sections" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "pots" CASCADE;
  DROP TABLE "employees" CASCADE;
  DROP TABLE "projects_blocks_text_block_paragraphs" CASCADE;
  DROP TABLE "projects_blocks_text_block" CASCADE;
  DROP TABLE "projects_blocks_image_block" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "blogs_blocks_text_block_paragraphs" CASCADE;
  DROP TABLE "blogs_blocks_text_block" CASCADE;
  DROP TABLE "blogs_blocks_image_block" CASCADE;
  DROP TABLE "blogs" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "newsletter_subscribers" CASCADE;
  DROP TABLE "clients_sessions" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "announcement_banner_announcements" CASCADE;
  DROP TABLE "announcement_banner" CASCADE;
  DROP TABLE "_announcement_banner_v_version_announcements" CASCADE;
  DROP TABLE "_announcement_banner_v" CASCADE;
  DROP TABLE "about_milestones" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "privacy_policy_sections" CASCADE;
  DROP TABLE "privacy_policy" CASCADE;
  DROP TYPE "public"."enum_products_availability";
  DROP TYPE "public"."enum_products_light_en";
  DROP TYPE "public"."enum_products_light_de";
  DROP TYPE "public"."enum_pots_availability";
  DROP TYPE "public"."enum_contact_submissions_status";
  DROP TYPE "public"."enum_newsletter_subscribers_status";
  DROP TYPE "public"."enum_clients_status";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_locale";
  DROP TYPE "public"."enum_announcement_banner_font_weight";
  DROP TYPE "public"."enum_announcement_banner_speed";
  DROP TYPE "public"."enum__announcement_banner_v_version_font_weight";
  DROP TYPE "public"."enum__announcement_banner_v_version_speed";`)
}

# Deployment Guide for Al-Arz Real Estate

This Next.js 16 App Router application is designed for seamless deployment on **Vercel** with a managed PostgreSQL database like **Neon** or **Vercel Postgres**.

## Prerequisites
- A GitHub repository containing this codebase.
- A [Vercel](https://vercel.com/) account.
- A managed PostgreSQL database (e.g., [Neon.tech](https://neon.tech/) or Vercel Postgres).

---

## Step 1: Database Setup (Neon)
1. Log into your Neon dashboard and create a new project.
2. Copy the **Postgres Connection String** (it should look like `postgresql://user:password@host/dbname?sslmode=require`).
3. (Optional but recommended) If using Prisma in serverless environments, you may need a connection pooler URL. Neon provides a pooled URL out of the box (often replacing `neondb` with your pooled DB name, or checking the "Pooled connection" toggle).

---

## Step 2: Vercel Deployment Setup
1. Log into Vercel and click **Add New... > Project**.
2. Import your GitHub repository.
3. In the **Configure Project** section, Vercel will automatically detect the Next.js framework. Leave the Build Command and Output Directory as default.

---

## Step 3: Environment Variables
Before clicking "Deploy", expand the **Environment Variables** section and add the following required keys:

| Key | Value | Description |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | The connection string from Step 1. |
| `AUTH_SECRET` | `your-secret-key` | A random 32+ char string used to encrypt sessions. You can generate one by running `npx auth secret` locally. |
| `AUTH_URL` | `https://your-app-domain.vercel.app` | The production URL of your application. *Note: If you are setting up a custom domain later, update this variable to match your custom domain.* |

---

## Step 4: Database Migration Pipeline
Since we use Prisma, the database schema needs to be pushed to your production database when building. We have automated this in `package.json`:

```json
"scripts": {
  "build": "prisma generate && prisma db push && next build"
}
```

This ensures that every time Vercel builds your project, it generates the latest Prisma client and pushes any schema changes to your Neon database safely.

*Note: For large production systems, it is recommended to use `prisma migrate deploy` instead of `db push`, but `db push` is perfectly fine for initial deployments and prototyping.*

---

## Step 5: Deploy
1. Click **Deploy**.
2. Vercel will run the build script, generate the Prisma client, push the schema to Neon, and compile the Next.js application.
3. Once complete, you will receive a public Vercel URL.
4. Visit your deployed site!

---

## Post-Deployment Checklist
- **First Admin Account:** If your database is entirely empty on production, the easiest way to create the first admin account is to seed it locally using your production `DATABASE_URL`, or temporarily allow public registration, or use Prisma Studio locally connected to the production DB (`npx prisma studio`).
- **File Uploads:** Currently, images are saved to `/public/uploads`. In a serverless environment like Vercel, the local filesystem is ephemeral and read-only. For true production readiness, you should replace the `/api/upload` endpoint logic to upload images to an S3 bucket (like AWS S3, Cloudflare R2, or UploadThing) instead of the local filesystem.

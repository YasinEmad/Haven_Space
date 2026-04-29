# Deployment Guide

## Deploying to Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with your code
- MongoDB Atlas account (https://mongodb.com/cloud/atlas) or other MongoDB hosting

### Step 1: Prepare MongoDB

1. Create a MongoDB Atlas account and cluster
2. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/database`)
3. Create a database user with appropriate permissions
4. Whitelist your Vercel deployment IP or use `0.0.0.0/0` for development

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Real estate platform"
git remote add origin https://github.com/yourusername/real-estate-platform.git
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Find and import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

### Step 4: Add Environment Variables

In Vercel project settings, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
UPLOADTHING_SECRET=your_secret_here
UPLOADTHING_APP_ID=your_app_id_here
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Step 5: Seed Database

After first deployment, you need to seed the database with demo data:

1. Connect to your MongoDB Atlas cluster
2. Run the seed script locally or use MongoDB Compass to insert data manually
3. Or use the API to create properties after logging in to the admin panel

### Environment Variables for Different Stages

**Development (.env.local):**
```
MONGODB_URI=mongodb://localhost:27017/real-estate
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-dev-secret
```

**Production (Vercel):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/realestatedb
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=your-prod-secret
```

### Post-Deployment Steps

1. **Create Admin Account:**
   - Visit your deployed app at `https://yourdomain.vercel.app/admin/login`
   - Create a new admin user via database

2. **Add Properties:**
   - Log in to admin dashboard
   - Start adding properties through the UI

3. **Configure Domain:**
   - In Vercel settings, add your custom domain
   - Update NEXTAUTH_URL accordingly

### Troubleshooting Deployments

**Build Fails:**
- Check that all dependencies are in package.json
- Verify Node.js version compatibility (18+)
- Review build logs for specific errors

**Database Connection Error:**
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**Authentication Issues:**
- Verify NEXTAUTH_SECRET is set in Vercel
- Check NEXTAUTH_URL matches your deployment URL
- Ensure database user exists

**Environment Variables Not Loading:**
- Redeploy after adding variables
- Check variables are in project settings (not just in root .env)

## Alternative Deployments

### Heroku
1. Create Procfile: `web: npm run start`
2. Push to Heroku: `git push heroku main`
3. Set environment variables via Heroku dashboard

### Railway
1. Connect GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Self-Hosted (VPS/EC2)
1. Install Node.js and npm/pnpm
2. Clone repository: `git clone your-repo`
3. Install dependencies: `pnpm install`
4. Build application: `pnpm build`
5. Start application: `pnpm start`
6. Use PM2 or systemd to manage process
7. Set up nginx as reverse proxy

## Database Migration

If moving from local MongoDB to production:

1. Export local database:
```bash
mongodump --uri "mongodb://localhost:27017/real-estate" --out ./dump
```

2. Restore to production:
```bash
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/" ./dump
```

## Monitoring & Maintenance

- Use Vercel Analytics to track performance
- Monitor MongoDB Atlas for connection issues
- Set up error tracking with Sentry
- Regular backups of MongoDB database
- Monitor deployment logs for errors

## Security Checklist

- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] Environment variables never committed to git
- [ ] CORS properly configured if needed
- [ ] Admin routes properly protected
- [ ] File uploads validated and scanned
- [ ] Rate limiting implemented for API

## Performance Optimization

1. Enable image optimization in Next.js
2. Implement caching headers
3. Use CDN for static assets
4. Optimize MongoDB indexes
5. Enable gzip compression
6. Consider API rate limiting

For more help, see:
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- NextAuth.js: https://next-auth.js.org/deployment

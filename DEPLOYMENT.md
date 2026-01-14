# Google Cloud Deployment Guide

This guide explains how to deploy PickBettr to Google Cloud Platform (Cloud Run).

## Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud SDK**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk)
3. **Docker**: Install from [docker.com](https://www.docker.com/get-started)
4. **Project Setup**: Create a new GCP project or use an existing one

## Initial Setup

### 1. Install Google Cloud SDK

```bash
# macOS
brew install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash

# Windows
# Download and run the installer from https://cloud.google.com/sdk/docs/install
```

### 2. Authenticate and Set Project

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Configure Environment Variables

Set your environment variables in Google Cloud Secret Manager or Cloud Run:

```bash
# Set Supabase credentials
gcloud run services update pickbettr \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key" \
  --set-env-vars="NEXT_PUBLIC_SITE_URL=https://your-domain.com" \
  --region=us-central1
```

Or use Secret Manager (recommended for production):

```bash
# Create secrets
echo -n "your_supabase_url" | gcloud secrets create supabase-url --data-file=-
echo -n "your_supabase_key" | gcloud secrets create supabase-key --data-file=-
echo -n "https://your-domain.com" | gcloud secrets create site-url --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding supabase-url \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Deployment Methods

### Method 1: Using Cloud Build (Recommended)

This is the easiest method using the provided `cloudbuild.yaml`:

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml

# The build will automatically:
# 1. Build the Docker image
# 2. Push to Container Registry
# 3. Deploy to Cloud Run
```

### Method 2: Manual Docker Build and Deploy

```bash
# Build the Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/pickbettr:latest .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/pickbettr:latest

# Deploy to Cloud Run
gcloud run deploy pickbettr \
  --image gcr.io/YOUR_PROJECT_ID/pickbettr:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### Method 3: Using service.yaml

```bash
# Build and push image first
docker build -t gcr.io/YOUR_PROJECT_ID/pickbettr:latest .
docker push gcr.io/YOUR_PROJECT_ID/pickbettr:latest

# Update PROJECT_ID in service.yaml, then deploy
gcloud run services replace service.yaml --region=us-central1
```

## ⚠️ IMPORTANT: Set Environment Variables

**You MUST set your Supabase environment variables after deployment, otherwise you'll see a "Supabase Not Configured" warning.**

### Option 1: Set via gcloud CLI (Recommended)

```bash
# Replace with your actual values
gcloud run services update pickbettr \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co,NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here,NEXT_PUBLIC_SITE_URL=https://your-domain.com" \
  --region=us-central1
```

### Option 2: Set via Google Cloud Console

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your `pickbettr` service
3. Click **"EDIT & DEPLOY NEW REVISION"**
4. Go to **"Variables & Secrets"** tab
5. Click **"ADD VARIABLE"** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_anon_key_here`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`
6. Click **"DEPLOY"**

### Option 3: Update cloudbuild.yaml (Advanced)

If you want to include env vars in the build process, modify `cloudbuild.yaml`:

```yaml
- '--set-env-vars'
- 'NODE_ENV=production,NEXT_PUBLIC_SUPABASE_URL=${_SUPABASE_URL},NEXT_PUBLIC_SUPABASE_ANON_KEY=${_SUPABASE_KEY},NEXT_PUBLIC_SITE_URL=${_SITE_URL}'
```

Then build with substitutions:
```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_SUPABASE_URL="https://your-project.supabase.co",_SUPABASE_KEY="your_key",_SITE_URL="https://your-domain.com"
```

## Post-Deployment

### 1. Get Your Service URL

```bash
gcloud run services describe pickbettr --region=us-central1 --format='value(status.url)'
```

### 2. Update Environment Variables

If you need to update environment variables after deployment:

```bash
gcloud run services update pickbettr \
  --update-env-vars="NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com" \
  --region=us-central1
```

### 3. Set Up Custom Domain (Optional)

```bash
# Map a custom domain
gcloud run domain-mappings create \
  --service pickbettr \
  --domain your-domain.com \
  --region us-central1

# Follow the DNS configuration instructions provided
```

## Continuous Deployment

### Set Up Cloud Build Triggers

1. Go to Cloud Build > Triggers in Google Cloud Console
2. Click "Create Trigger"
3. Connect your repository (GitHub, GitLab, etc.)
4. Set configuration:
   - **Name**: `pickbettr-deploy`
   - **Event**: Push to a branch
   - **Branch**: `^main$` (or your main branch)
   - **Configuration**: Cloud Build configuration file
   - **Location**: `cloudbuild.yaml`
5. Save the trigger

Now, every push to main will automatically build and deploy!

## Monitoring and Logs

### View Logs

```bash
# Stream logs
gcloud run services logs tail pickbettr --region=us-central1

# View recent logs
gcloud run services logs read pickbettr --region=us-central1 --limit=50
```

### Monitor Performance

- Go to Cloud Run in Google Cloud Console
- Click on your service
- View metrics, logs, and revisions

## Troubleshooting

### Build Fails

1. Check build logs:
   ```bash
   gcloud builds list --limit=5
   gcloud builds log BUILD_ID
   ```

2. Common issues:
   - Missing environment variables
   - Docker build timeout (increase in cloudbuild.yaml)
   - Memory issues (increase machine type)

### Service Won't Start

1. Check service logs:
   ```bash
   gcloud run services logs read pickbettr --region=us-central1
   ```

2. Verify environment variables are set correctly
3. Check that Supabase credentials are valid
4. Ensure port 3000 is exposed

### High Latency

1. Increase memory allocation:
   ```bash
   gcloud run services update pickbettr \
     --memory 2Gi \
     --region=us-central1
   ```

2. Set minimum instances to avoid cold starts:
   ```bash
   gcloud run services update pickbettr \
     --min-instances 1 \
     --region=us-central1
   ```

## Cost Optimization

- **Min instances**: Set to 0 to avoid charges when idle
- **Max instances**: Adjust based on traffic
- **Memory/CPU**: Start with 1Gi/1 CPU, scale as needed
- **Region**: Choose closest to your users

## Security Best Practices

1. **Use Secret Manager** for sensitive data (Supabase keys)
2. **Enable IAM** to control who can deploy
3. **Use HTTPS only** (Cloud Run provides this by default)
4. **Set up VPC** if connecting to private resources
5. **Enable Cloud Armor** for DDoS protection (if needed)

## Next Steps

1. Set up a custom domain
2. Configure CDN (Cloud CDN) for better performance
3. Set up monitoring alerts
4. Configure backup and disaster recovery
5. Set up CI/CD pipeline

For more information, visit:
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

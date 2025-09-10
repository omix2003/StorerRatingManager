# 🚀 Deployment Guide for StoreRate

## Frontend Deployment on Render

### Prerequisites
1. GitHub repository with your code
2. Render account (free tier available)
3. Backend deployed (if not using localhost)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done)
2. **Make sure your backend is deployed** or update the API URL

### Step 2: Deploy Frontend on Render

#### Option A: Using Render Dashboard (Recommended)

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Static Site"**
3. **Connect your GitHub repository**
4. **Configure the deployment:**
   - **Name**: `store-rate-frontend` (or any name you prefer)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Add Environment Variables:**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-app.onrender.com/api`
   - (Replace with your actual backend URL)

6. **Click "Create Static Site"**

#### Option B: Using render.yaml (Advanced)

1. **Use the provided `render.yaml` file**
2. **Update the environment variables in the file**
3. **Deploy using Render's Blueprint feature**

### Step 3: Configure Environment Variables

In your Render dashboard, add these environment variables:

```
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
```

### Step 4: Deploy Backend (If Needed)

If you haven't deployed your backend yet:

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `store-rate-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-jwt-secret
   ```

### Step 5: Database Setup

For production, you'll need a PostgreSQL database:

1. **Create a PostgreSQL database on Render**
2. **Update your backend environment variables** with the database credentials
3. **Run database migrations** (if needed)

### Step 6: Update Frontend API URL

Once your backend is deployed:

1. **Copy your backend URL** from Render dashboard
2. **Update the `VITE_API_BASE_URL`** environment variable in your frontend service
3. **Redeploy your frontend** (it will auto-deploy on changes)

### Step 7: Test Your Deployment

1. **Visit your frontend URL**
2. **Test user registration and login**
3. **Test store creation and rating functionality**

## 🎯 Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Database configured
- [ ] Frontend deployed on Render
- [ ] Environment variables set
- [ ] API URL updated
- [ ] Application tested

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**: Check your build command and dependencies
2. **API Errors**: Verify your backend URL and CORS settings
3. **Database Connection**: Check your database credentials
4. **Environment Variables**: Ensure all required variables are set

### Support:
- Check Render logs in the dashboard
- Verify your GitHub repository is connected
- Test locally first before deploying

## 📝 Notes

- Render provides free tier with limitations
- Auto-deploy on Git push is enabled by default
- Custom domains can be added in the Pro plan
- SSL certificates are automatically provided

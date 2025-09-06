# Deployment Guide for Feather Press

This guide will help you deploy your Feather Press application across Netlify (frontend), Render (backend), and Aiven (MySQL database).

## 1. Database Deployment (Aiven)

### Setup MySQL on Aiven

1. Log in to your Aiven account
2. Create a new MySQL service
3. Select your preferred cloud provider and region
4. Choose an appropriate plan
5. Once created, go to the service overview page to get your connection details:
   - Host: `mysql-xxxxx.aivencloud.com`
   - Port: `13605` (typically)
   - Username: `avnadmin` (default)
   - Password: (from Aiven dashboard)
   - Database: `defaultdb` (default)

### Download SSL Certificate

1. From your Aiven MySQL service page, download the CA certificate
2. Save it as `aiven-ca.pem`

## 2. Backend Deployment (Render)

## Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Name: `feather-press`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

### Set Environment Variables

Add the following environment variables in the Render dashboard:

```
NODE_ENV=production
PORT=3001
MYSQL_HOST=your-mysql-host.aivencloud.com
MYSQL_PORT=13605
MYSQL_USER=avnadmin
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=defaultdb
MYSQL_SSL=true
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Upload SSL Certificate

1. In the Render dashboard, go to your web service
2. Navigate to the "Environment" tab
3. Under "Secret Files", add a new secret file
4. Name: `MYSQL_SSL_CA_PATH`
5. File contents: Copy and paste the contents of your `aiven-ca.pem` file

## 3. Frontend Deployment (Netlify)

### Deploy to Netlify

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Set Environment Variables

Add the following environment variable in the Netlify dashboard:

```
VITE_API_BASE_URL=https://your-render-app.onrender.com/api
```

## 4. Verify Deployment

1. Visit your Netlify URL to ensure the frontend is working
2. Test API endpoints through your browser or tools like Postman
3. Check Render logs for any backend errors
4. Verify database connections in the Render logs

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Ensure the `FRONTEND_URL` in your Render environment variables exactly matches your Netlify URL
2. Check the CORS configuration in `server.js`

### Database Connection Issues

If the backend can't connect to the database:

1. Verify all MySQL environment variables are correct
2. Check that the SSL certificate is properly uploaded to Render
3. Look for connection errors in the Render logs

### Frontend API Connection Issues

If the frontend can't connect to the backend:

1. Ensure `VITE_API_BASE_URL` is correctly set in Netlify
2. Check that the backend is running properly on Render
3. Verify the API endpoints are working by testing them directly

## Maintenance

### Updating Your Application

1. Push changes to your GitHub repository
2. Netlify and Render will automatically rebuild and deploy your application

### Monitoring

1. Use Render's built-in logs to monitor backend performance
2. Check Aiven's dashboard for database metrics
3. Use Netlify's analytics for frontend monitoring
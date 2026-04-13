# Tanu Ice Cream - Strapi CMS Backend

This is the Strapi CMS backend for Tanu Ice Cream product management.

## 📁 Project Structure

```
tanu-strapi-backend/
├── src/
│   └── api/
│       ├── category/       # Category content type
│       └── product/        # Product content type
├── config/                 # Strapi configuration
├── data/
│   └── seed.js            # Initial data (categories + products)
├── package.json
└── .env
```

## 🚀 Quick Start (Local Development)

1. **Install dependencies:**
   ```bash
   cd tanu-strapi-backend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run develop
   ```

3. **Access the admin panel:**
   - Open http://localhost:1337/admin
   - Create your first admin account
   - Your data will be automatically seeded!

## ☁️ Deploy to Strapi Cloud

### Step 1: Push to GitHub
```bash
cd tanu-strapi-backend
git init
git add .
git commit -m "Initial Strapi project"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Connect to Strapi Cloud
1. Go to [strapi.cloud](https://strapi.cloud)
2. Click **"New Project"**
3. Connect your GitHub repository
4. Strapi Cloud will automatically detect the project
5. Click **"Deploy"**

### Step 3: Configure Your Project
After deployment:
1. Go to your Strapi Cloud dashboard
2. Copy your **Project URL** (e.g., `https://your-project.strapiapp.com`)
3. Create an **API Token**:
   - Go to **Settings** → **API Tokens**
   - Click **"Create new API Token"**
   - Name: `Tanu Frontend`
   - Type: **Read-only**
   - Copy the token

### Step 4: Update Your Frontend
In your main project's `index.js`, update the CONFIG:

```javascript
var CONFIG = {
  STRAPI_BASE: 'https://your-project.strapiapp.com',  // ← Your Strapi Cloud URL
  STRAPI_PATH: '/api/products?populate=category,image',
  API_TOKEN: 'your-api-token-here',  // ← Add this
  FETCH_TIMEOUT_MS: 5000
};
```

Then update the fetch call to include the token:

```javascript
fetch(url, {
  ...fetchOpts,
  headers: {
    'Authorization': `Bearer ${CONFIG.API_TOKEN}`
  }
})
```

## 👥 Employee Access

To allow shop employees to edit content:

1. **Go to Strapi Admin:** `https://your-project.strapiapp.com/admin`

2. **Create Employee Account:**
   - Go to **Settings** → **Administration Panel** → **Users**
   - Click **"Invite new user"**
   - Enter employee email
   - Role: **Editor** (can edit content, but not manage users/settings)

3. **Employee can now:**
   - Login at `/admin`
   - Add/edit/delete products
   - Upload product images
   - Manage categories

## 📊 Content Structure

### Categories
- **Name**: Category name (e.g., "Морозиво")
- **Key**: Unique identifier (e.g., "ice-cream")

### Products
- **Name**: Product name (e.g., "Макадамія")
- **Slug**: URL-friendly identifier (auto-generated from name)
- **Category**: Relation to Category
- **Price**: Price in UAH (e.g., 100)
- **Description**: Product description
- **Image**: Product image (media upload)

## 🔧 API Endpoints

After deployment, your API will be available at:

- **Products**: `GET https://your-project.strapiapp.com/api/products?populate=*`
- **Categories**: `GET https://your-project.strapiapp.com/api/categories?populate=*`
- **Single Product**: `GET https://your-project.strapiapp.com/api/products/1?populate=*`

## 📝 Environment Variables

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="toBeModified1,toBeModified2"
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
TRANSFER_TOKEN_SALT=tobemodified
JWT_SECRET=tobemodified
```

**Important**: Change all secret values before deploying to production!

## 🎨 Next Steps

1. ✅ Deploy to Strapi Cloud
2. ✅ Update frontend `index.js` with your Strapi URL
3. ✅ Upload product images via admin panel
4. ✅ Create employee accounts
5. ✅ Test the integration

## 🆘 Troubleshooting

**Issue**: "Unable to find package.json"
- **Solution**: Make sure you're deploying the `tanu-strapi-backend` folder, not the root project

**Issue**: Products not showing
- **Solution**: Check that API token has correct permissions (Settings → API Tokens)

**Issue**: CORS errors
- **Solution**: Add your frontend domain to CORS settings in Strapi admin

## 📞 Support

For Strapi Cloud support: [docs.strapi.cloud](https://docs.strapi.cloud)

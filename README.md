# E-commerce Store with Saleor & Next.js

A modern, full-stack e-commerce platform built with Saleor (headless commerce) and Next.js 16.

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **Zustand** - State management (cart)

### Backend
- **Saleor** - Headless commerce platform
- **Django** - Python web framework
- **PostgreSQL** - Database
- **GraphQL** - API layer
- **Docker** - Containerization

### Payment Gateway
- **Sonali Bank** - Payment processing (integration ready)

## 📁 Project Structure

```
ecommerce-saleor/
├── saleor-backend/          # Saleor API (Django)
│   ├── docker-compose.yml
│   └── ...
│
└── storefront/              # Next.js frontend
    ├── src/
    │   ├── app/             # Next.js App Router pages
    │   ├── components/      # React components
    │   ├── lib/             # Apollo client, utilities
    │   ├── graphql/         # GraphQL queries
    │   └── types/           # TypeScript types
    └── ...
```

## ✨ Features

### Implemented
- ✅ Product browsing with categories
- ✅ Product detail pages
- ✅ Shopping cart (persistent)
- ✅ Live search
- ✅ Category filtering
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Cart management (add/remove/update quantities)

### In Progress
- 🔄 Checkout flow
- 🔄 Sonali Payment Gateway integration
- 🔄 Product reviews & ratings
- 🔄 User authentication
- 🔄 Order management

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Docker Desktop
- Git

### Backend Setup (Saleor)

1. **Start Saleor with Docker:**
   ```bash
   cd saleor-backend
   docker-compose up -d
   ```

2. **Run migrations:**
   ```bash
   docker-compose exec api python manage.py migrate
   ```

3. **Create superuser:**
   ```bash
   docker-compose exec api python manage.py createsuperuser
   ```

4. **Populate sample data (optional):**
   ```bash
   docker-compose exec api python manage.py populatedb
   ```

5. **Verify Saleor is running:**
   - API: http://localhost:8000/graphql/
   - Dashboard: http://localhost:9000/

### Frontend Setup (Next.js)

1. **Install dependencies:**
   ```bash
   cd storefront
   npm install
   ```

2. **Create `.env.local`:**
   ```env
   NEXT_PUBLIC_SALEOR_API_URL=http://localhost:8000/graphql/
   NEXT_PUBLIC_SITE_NAME=My Store
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Visit:** http://localhost:3000

## 🧪 Testing

### Products Page
```
http://localhost:3000/products
```

### Category Pages
```
http://localhost:3000/categories/apparel
http://localhost:3000/categories/groceries
```

### Cart
```
http://localhost:3000/cart
```

### Search
Use the search bar in the navbar to search for products.

## 📚 Key Components

### Navigation
- `Navbar.tsx` - Main navigation with cart counter
- `Footer.tsx` - Site footer
- `SearchBar.tsx` - Live search functionality

### Product Display
- `ProductCard.tsx` - Reusable product card
- `AddToCartButton.tsx` - Add to cart with feedback

### Shopping
- `CategorySidebar.tsx` - Category filtering
- Cart store (Zustand) - Persistent cart state

## 🔑 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_SALEOR_API_URL=http://localhost:8000/graphql/
NEXT_PUBLIC_SITE_NAME=My Store
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (Docker)
Configured via `docker-compose.yml`

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd storefront
vercel
```

### Backend (Production)
Update Saleor environment variables and deploy via Docker or cloud platform.

## 🤝 Contributing

This is a learning project. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- [Saleor](https://saleor.io/) - Headless commerce platform
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL client

## 📧 Contact

For questions or feedback, please open an issue.

---

Built with ❤️ using Saleor and Next.js
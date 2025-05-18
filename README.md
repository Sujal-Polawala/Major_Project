
# 🛍️ TryNBuy - Virtual Shopping with Seamless Payment

An AI-powered fashion e-commerce platform that allows users to browse, try-on, and buy fashion products, while offering sellers and admins full control over product management and analytics.

## 📂 Repository Structure
```
Major_Project/
│
├── client/        # Frontend - React.js, Tailwind CSS, Material UI
├── backend/       # Backend - Node.js, Express.js, MongoDB, Stripe integration
├── admin/         # Admin panel - user/product/order management
├── README.md      # Project documentation
└── ...
```

## 🛠️ Features

### 🛒 User Storefront
- Product browsing with categories, filters and Text/Voice Search.
- AI-based image search to find similar products.
- Virtual try-on experience using webcam or image upload.
- Secure checkout with Stripe payment integration.
- Automatic invoice generation after successful delivery.

### 🧑‍💼 Seller Portal
- Send request to admin for Login.
- Product management (CRUD operations).
- View order details and update order status.
- Dashboard showing earnings and performance.

### 🔐 Admin Dashboard
- Approve/reject sellers and products.
- Manage users, categories, and coupons.
- View products and orders.
- Generate reports and monitor platform activity.

## 💻 Tech Stack

| Category   | Technologies Used                          |
|------------|---------------------------------------------|
| Frontend   | React.js, Tailwind CSS, Material UI         |
| Backend    | Node.js, Express.js, Python                 |
| Database   | MongoDB                                     |
| AI Features| Python-based image processing (MediaPipe)   |
| Payment    | Stripe API                                  |
| Dev Tools  | Git, GitHub, VS Code                        |

## 📦 Installation & Setup

### Clone the repository
```bash
git clone https://github.com/Sujal-Polawala/Major_Project.git
cd Major_Project
```

### Set Up Environment Variables
Create `.env` files in the respective directories as needed (e.g., `client/.env`, `backend/.env`, `admin/.env`) and add the following:

```env
# backend/.env
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh-token-secret
REFRESH_ENCRYPTION_KEY=your_refresh-encryption_key
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_apppassword
MONGO_URI=your_mongodb_uri
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_api_key
CLOUDINARY_API_SECRET=your_cloud_api_secret
```

### Install client dependencies
```bash
cd client
npm install
npm start
```

### Install backend dependencies
```bash
cd ../backend
npm install
nodemon start
```

### (A) Run Python server for AI features (Use Backend Folder)
```bash
pip install -r requirements.txt
python app.py
```
### (B) Stripe Webhook Listener (for payment updates, Use Backend Folder)
You must have the Stripe CLI installed.

```bash
stripe login
stripe listen --forward-to localhost:5000/api/stripe-webhook
```

### Run admin panel
```bash
cd ../admin
npm install
npm start
```

> 💡 Make sure correctly configured in your `.env` files in all folders.


---

## 🔒 License
This project is licensed under the MIT License.

## 🙋‍♂️ Author
- [Sujal Polawala](https://github.com/Sujal-Polawala)

## 👥 Contributors
- [Sujal Polawala](https://github.com/Sujal-Polawala)
- [Sahil Rana](https://github.com/Ranasahil19)
- [Rishi Kothari]

# United Associates Agencies

A premium optical e-commerce web application designed for **United Associates Agencies**, showcasing a curated collection of eyewear brands, lenses, and optical solutions.

## 🚀 Features

- **Modern & Premium UI**: Features a dark-themed, glassmorphic design for a luxurious user experience.
- **Dynamic Product Catalog**: Browse products categorised by Brands, Lenses, and Origins (In-House, Indian, International).
- **Responsive Navigation**: Smooth navigation between Home, Catalog, and Booking flows.
- **Inventory Management**: Real-time stock tracking with visual indicators for low stock.
- **Shopping Cart**: Persistent cart functionality (saved to local storage) with "Add to Cart" and quantity management.
- **Smart Booking System**:
    - Stock validation before booking.
    - Integrated **Razorpay** payment gateway for secure transactions.
    - **Email Notifications** via EmailJS upon successful orders.
    - **Firebase Firestore** backend to store bookings and manage inventory.
- **Store Locator**: Find physical store locations easily.
- **WhatsApp Integration**: Instant customer support via a floating WhatsApp widget.

## 🛠 Tech Stack

### **Frontend**
- **Framework**: [React v19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Modern features: Variables, Flexbox/Grid, Glassmorphism)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)

### **Backend & Services**
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) (NoSQL)
- **Payment Gateway**: [Razorpay](https://razorpay.com/)
- **Email Service**: [EmailJS](https://www.emailjs.com/)

## 📂 Project Structure

```bash
src/
├── assets/         # Static assets
├── components/     # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ModelCatalog.jsx
│   ├── BookingForm.jsx
│   ├── ...
├── hooks/          # Custom React hooks (e.g., useInventory)
├── lib/            # External library configurations (Firebase)
├── styles/         # Global CSS styles
├── utils/          # Utility functions (Seeding scripts)
├── App.jsx         # Main application layout
└── main.jsx        # Entry point
```

## ⚙️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Zeeshan023Baig/united-associates-booking.git
    cd united-associates-booking
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    - Configure your Firebase keys in `src/lib/firebase.js`.
    - Configure EmailJS keys in `src/components/BookingForm.jsx`.
    - Configure Razorpay key in `src/components/BookingForm.jsx`.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Build for Production**:
    ```bash
    npm run build
    ```

## © License

© 2025 United Associates Agencies. All rights reserved.

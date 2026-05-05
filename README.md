# 🚗 X RENT A CAR: Enterprise Fleet Operations Center
### *Powered by Sy Nexis*

**X RENT A CAR** is a production-grade, real-time fleet management ecosystem designed for the next generation of logistics and rental operations. Developed by **Sy Nexis**, this platform bridges the gap between complex telemetry data and intuitive user experience through a high-performance, Apple-inspired interface.

---

## 🏗 The Architecture of Speed
At **Sy Nexis**, we prioritize "Time to Interactive" and robust security. xrent CAR is built on a **Zero-Footprint, Utility-First** strategy:

*   **Hybrid Rendering Shell**: Leverages **Next.js 14+ App Router** to execute data fetching on the server, eliminating client-side API latency.
*   **Edge-Level Security**: A custom **TypeScript Middleware** layer acts as a global "Vault" guard, intercepting unauthorized requests before page hydration.
*   **Optimized Data Pipeline**: Utilizes **MySQL connection pooling** in a Node.js/TypeScript backend to handle high-frequency telemetry updates from the fleet.

---

## 🛠 Tech Stack

| Category | Implementation |
| :--- | :--- |
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MySQL (Relational Schema) |
| **Security** | JWT (JSON Web Tokens), Bcrypt Hashing, Edge Middleware |
| **Design** | Adaptive Dark/Light Mode, Glassmorphism, SF Pro Typography |

---

## ✨ Strategic Features

### 🛡 The Secure Vault (Auth)
*   **Role-Based Access (RBAC)**: Distinct permissions for SuperAdmins, FleetManagers, and Staff.
*   **Staff Registry**: Comprehensive management of personnel records and account statuses.

### 📊 Real-Time Operations Hub
*   **Live Fleet Map**: A stylized, real-time GPS grid tracking 48+ vehicles with status-dependent markers.
*   **Telemetry Detail**: Granular tracking of speed, heading, altitude, and 4G signal strength.
*   **Activity Ledger**: A chronological log of critical fleet events, including fuel stops and speed alerts.

### 🎨 Adaptive User Interface
*   **Native Theming**: Intelligent Light and Dark mode transition with zero-flicker persistence.
*   **High-Fidelity UI**: Premium cards featuring `backdrop-blur` and `border-white/10` micro-details.

---

## 🚀 Deployment & Installation

### 1. Prerequisites
*   **Node.js 18.x** or higher
*   **MySQL Instance** (v8.0+)

### 2. Environment Configuration (`.env`)
Configure your backend and database credentials. Generate a secure `JWT_SECRET` for production using `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.

```env
PORT=8801
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=xrent_db
JWT_SECRET=your_secure_hex_string
```

### 3. Setup
```bash
# Clone the repository
git clone https://github.com/sy-nexis/xrent-car.git

# Install dependencies
npm install

# Build for production
npm run build
```

---

## 🏢 About Sy Nexis
**Sy Nexis** is a software engineering firm specializing in high-performance web aesthetics and resource-optimized UI designs. Our guiding principle is to balance minimalist beauty with technical rigidity.

---

**© 2026 Sy Nexis. All Rights Reserved.**

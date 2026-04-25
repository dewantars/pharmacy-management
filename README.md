<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">💊 Pharmacy Management System</h1>

<p align="center">
Backend API untuk sistem manajemen apotek berbasis REST API menggunakan NestJS, Prisma, dan PostgreSQL.
</p>

<p align="center">

[![CI Pipeline](https://github.com/dewantars/pharmacy-management/actions/workflows/ci.yml/badge.svg)](https://github.com/dewantars/pharmacy-management/actions/workflows/ci.yml)

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=dewantars_pharmacy-management&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dewantars_pharmacy-management)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=dewantars_pharmacy-management&metric=bugs)](https://sonarcloud.io/summary/new_code?id=dewantars_pharmacy-management)

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=dewantars_pharmacy-management&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=dewantars_pharmacy-management)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=dewantars_pharmacy-management&metric=coverage)](https://sonarcloud.io/summary/new_code?id=dewantars_pharmacy-management)

</p>

---

## 📌 Description

Pharmacy Management System adalah backend service untuk mengelola operasional apotek secara digital.

### Fitur utama:
- Manajemen data obat
- Kategori obat
- Supplier
- Transaksi penjualan
- Order pembelian
- Activity logging
- Authentication & Authorization

---

## 🧱 Tech Stack

- Framework: NestJS
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT + Passport
- Testing: Jest
- CI/CD: GitHub Actions
- Code Quality: SonarCloud

---

## ⚙️ Installation

```bash
npm install
```

---

## 🔑 Environment Variables

Buat file `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pharmacy_db"
JWT_SECRET="your_secret_key"
```

---

## 🗄️ Database Setup (Prisma)

```bash
# generate prisma client
npx prisma generate

# migrate database
npx prisma migrate dev

# buka prisma studio
npx prisma studio
```

---

## ▶️ Run Application

```bash
# development
npm run start:dev

# production
npm run start:prod
```

Akses:

```
http://localhost:3000
```

---

## 🧪 Testing

```bash
# unit test
npm run test

# watch
npm run test:watch

# coverage
npm run test:cov
```

---

## 🚀 CI/CD Pipeline

Pipeline menggunakan GitHub Actions.

### Workflow:
1. Install dependencies  
2. Generate Prisma Client  
3. Build project  
4. Run test  
5. SonarCloud analysis  

File:
```
.github/workflows/ci.yml
```

---

## 📊 Code Quality (SonarCloud)

Analisis mencakup:
- Bugs  
- Vulnerabilities  
- Code Smells  
- Test Coverage  

Link:
https://sonarcloud.io/project/overview?id=dewantars_pharmacy-management

---

## 🔐 Authentication

Menggunakan JWT dan Passport.

### Endpoint:
```
POST /api/auth/sign-in
POST /api/auth/sign-out
```

---

## 📂 API Endpoints

### 👨‍⚕️ Employee
```
GET    /api/employees
POST   /api/employees
GET    /api/employees/:id
PATCH  /api/employees/:id
DELETE /api/employees/:id
```

### 💊 Medicine
```
GET    /api/medicine-data/medicines
POST   /api/medicine-data/medicines
PATCH  /api/medicine-data/medicines/:id
DELETE /api/medicine-data/medicines/:id
```

### 🏷️ Category
```
GET    /api/medicine-data/medicine-categories
POST   /api/medicine-data/medicine-categories
```

### 🚚 Supplier
```
GET    /api/suppliers
POST   /api/suppliers
```

### 💰 Transactions
```
GET    /api/finances/transactions
POST   /api/finances/transactions
```

### 📦 Orders
```
GET    /api/finances/medicine-orders
POST   /api/finances/medicine-orders
```

---

## 🧭 Project Structure

```
src/
│
├── common/
│   ├── database/
│   ├── security/
│   └── interceptors/
│
├── module/
│   ├── medicine-module/
│   ├── transaction-module/
│   ├── user-manage-module/
│   └── logs-module/
│
└── main.ts
```

---

## 📸 Screenshot (Opsional)

```
docs/
 ├── sonar.png
 ├── coverage.png
 └── api.png
```

---

## ⚠️ Troubleshooting

### Cannot GET /

Ini normal karena backend API.

Gunakan endpoint:
```
/api/*
```

---

### Prisma error

```
npx prisma generate
```

---

### Test error

Pastikan:
- ts-jest aktif  
- module commonjs  

---

## 👨‍💻 Author

Dewanta Rahma Satria

---

## 📄 License

MIT License
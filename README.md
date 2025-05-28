</div>

<div align="center">

# Context Zero

<strong>Secure, Scalable Cloud File Storage with AES-256 Encryption, JWT, and MFA</strong>

<p>Host Context Zero on your own server and securely manage encrypted files with time-limited sharing links, multi-factor authentication, and seamless AWS S3 integration.</p>



</div>

---

## 🔍 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Running the Project](#running-the-project)  
  - [Docker Setup](#docker-setup)  
  - [Manual Setup (Non-Docker)](#manual-setup-non-docker)  
- [Common Installation Issues](#common-installation-issues)  
- [Screenshots](#screenshots)  
- [Testing](#testing)  
- [Bug Reports & Feature Requests](#bug-reports--feature-requests)  
- [Known Issues & Future Improvements](#known-issues--future-improvements)  

---

## ⭐️ Features

- AES-256 encrypted file upload and download  
- JWT-based authentication with refresh tokens  
- Multi-factor authentication (MFA) for enhanced security  
- Time-limited, secure file sharing links  
- AWS S3 cloud storage integration  
- React frontend with Redux state management  
- Scalable Node.js + Express backend architecture  
- MongoDB for file metadata storage  
- User-friendly UI with file previews and media gallery  
- Dockerized deployment for easy setup and scaling  
- API validation and role-based access control  
- Comprehensive unit and integration testing with Jest  

---

## 👨‍🔬 Tech Stack

| Frontend                    | Backend                   | Database     | Cloud & DevOps         | Security               |
|-----------------------------|---------------------------|--------------|------------------------|------------------------|
| React, Redux, TypeScript, Vite | Node.js, Express, TypeScript | MongoDB (Mongoose) | AWS S3, Docker, Docker Compose | AES-256, JWT, TOTP MFA |

---

## 🏃 Running the Project

### 🐳 Docker Setup (Recommended)

> Requirements: Docker, Docker Compose

1. Copy the provided `.env.example` and `docker-compose.yml` to your working directory.  
2. Rename `.env.example` to `.env` and update the configuration values as needed (MongoDB URI, JWT secrets, AWS credentials, etc.).  
3. Start the services:

```bash
docker compose up -d


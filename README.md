<div align="center">

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
- [Common Installation Issues](#common-installation-issues)  
- [Screenshots](#screenshots)  
- [Testing](#testing)  
- [Bug Reports & Feature Requests](#bug-reports--feature-requests)  
- [Future Improvements](#known-issues--future-improvements)  

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

### Requirements:
- Node.js v20+  
- MongoDB (local or managed service like Atlas)  
- AWS S3 credentials (optional, if using cloud storage)  
- FFMPEG (optional, for video thumbnail generation)

### Steps to Run:

1. Install the dependencies:

```bash
npm i
```

2. Set the environment to **development**:

```bash
export NODE_ENV=development
```

3. Run the development server:

```bash
npm run dev
```

4. Access the app at: `http://localhost:3000`

---

## ⚠️ Common Installation Issues

* **Linux Build Tools Missing:** Install required packages:

```bash
sudo apt-get install build-essential
```

* **Node.js Memory Issues on Build:** Increase memory allocation for Node:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 📸 Screenshots

* Modern and Colorful Design

  ![image](https://github.com/user-attachments/assets/a7f2b63a-2e7f-4133-813b-0e72001ab957)

* Upload Files

  ![image](https://github.com/user-attachments/assets/0d4d8c06-170a-4a94-8c76-ac5ab5e7ceea)

* Image Viewer

  ![image](https://github.com/user-attachments/assets/c50c0075-a0f6-4b05-962c-3f7d870b2e10)

* Video Viewer

  ![image](https://github.com/user-attachments/assets/65292229-4c04-42a1-9513-b5c96692114a)

* Media Gallery

  ![image](https://github.com/user-attachments/assets/81f72845-9f7e-4c70-baa1-152ff6b4f325)

* Share Files

  ![image](https://github.com/user-attachments/assets/358413d2-8afd-4ac8-b7f2-d4980fc4b0f5)

* Search For Files & Folders

  ![image](https://github.com/user-attachments/assets/a181b9c1-34f6-4ed8-825e-395c08e99ad4)

* Move Files & Folders

  ![image](https://github.com/user-attachments/assets/705b649c-6222-4400-9871-753aefc7897b)

* Multi-Select

  ![image](https://github.com/user-attachments/assets/00fbaf9c-63e6-415f-a926-a5a88e2bd7d3)

* Custom Context Menue

  ![image](https://github.com/user-attachments/assets/cfac6f32-2ca6-4022-b7e3-b0eb3d30aeb6)

* Trash

  ![image](https://github.com/user-attachments/assets/870cb1d3-ba87-4af6-87ab-e7d5e6f5101b)










  



---

## 🧪 Testing

Tests are written in Jest and located in the `tests/` directory.

Run tests with:

```bash
npm run test
```

Tests cover:
* JWT authentication and token refresh
* File upload/download functionality
* MFA validation flows

---

## 🔮 Future Improvements

* Implement comprehensive audit logging and monitoring for enhanced security and compliance.
* Develop behavioral anomaly detection to identify and mitigate suspicious activities dynamically.
* Introduce device trust management to allow users to manage and verify trusted devices.
* Build mobile applications for iOS and Android to increase accessibility and user convenience.
* Optimize system performance and scalability to support enterprise-level file storage and user concurrency.
* Enhance the administrative dashboard with dynamic, user-friendly policy management tools.
* Integrate with third-party identity providers (e.g., OAuth, SAML) for federated authentication.
* Explore real-time notification systems for instant alerts on security and file-sharing events.










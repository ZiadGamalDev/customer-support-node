# Customer Support System – Backend (Node.js)

A powerful real-time backend system that handles **customer support ticketing, agent assignment**, and **chat functionality** for e-commerce platforms.

This project was developed as the **core engine** of the ITI Graduation Project — designed to simulate live support between external customers and internal agents via scalable WebSocket-powered infrastructure.

---

## ⚙️ Core Features

- 🔐 JWT Authentication
- 🧑‍💼 Role-based Access (Admin, Agent, Customer, etc.)
- 💬 Real-time Chat via Socket.IO
- 🧠 Smart Ticket Assignment Logic
  - Agents auto-assigned based on availability & max load
  - Pending chats re-assigned automatically
- 📦 MongoDB Activity Logs for:
  - Agent status tracking
  - Chat status history
- 🧭 Admin Control Panel API:
  - See agent availability and chat load
  - Reassign or close tickets manually
- 🌐 Fully API-ready for plug-and-play with any front-end client

---

## 🧱 System Design

This backend is built to **plug into any e-commerce frontend**, assigning customer chats to available agents. It supports dynamic agent availability, real-time messaging, and chat logging.

**Supported Status Flows:**
- **User Status:** Available, Busy, Away
- **Chat Status:** New, Open, Pending, Resolved

---

## 🔐 Auth & Roles

- `user`: default for new registrations
- `admin`: manages system & users
- `agent`: supports live customers
- `customer`: dynamically created from chat

Each role comes with its own middleware and access restrictions. Token-based authentication is used for both HTTP and WebSocket connections.

---

## 🧪 Seeding & Testing

The project includes basic seeders (`src/database/seeders`) for testing:
- ✅ Admin
- ✅ Multiple agents
- ✅ User for login

> Run the seeder to populate test data for users and simulate chat flow easily.

---

## 📬 Postman Collection

You'll find a **Postman collection** for testing all endpoints in:

```
public/Customer-Support.postman_collection.json
```

---

## 🛠️ Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Auth
- Joi Validation
- Modular Clean Architecture

---

## 🔗 Part of a Multi-App System

This backend connects with other micro-apps like:

- Agent dashboard → Angular frontend
- Customer chat → React frontend
- E-commerce system → For simulating live customers

👉 [View Root Repository](https://github.com/ZiadGamalDev/customer-support-system)

---

## 📄 License

MIT — Feel free to explore, clone, and build on top of it.

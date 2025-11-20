# Customer Support System – Backend (Node.js)

A powerful real-time backend system that handles **customer support ticketing, agent assignment**, and **chat functionality** for e-commerce platforms.

This project was developed as the **core engine** of the ITI Graduation Project — designed to simulate live support between external customers and internal agents via scalable WebSocket-powered infrastructure.

## 🌐 **Live Demo**
- **Production API**: https://customer-support-api.ziadgamal.com
- **API Status**: https://customer-support-api.ziadgamal.com/dev/test
- **Beautiful Landing Page**: Professional API documentation with features overview

## 🚀 **Quick Start**

### **Production Environment**
The backend is deployed and ready to use:
```bash
API_URL=https://customer-support-api.ziadgamal.com
SOCKET_URL=https://customer-support-api.ziadgamal.com
```

### **Local Development**
1. Clone the repository:
   ```bash
   git clone https://github.com/ZiadGamalDev/customer-support-node.git
   cd customer-support-node
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Update .env with your local MongoDB and email settings
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:3000`

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

## 🛠️ **Tech Stack**

- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose ODM
- **Real-time**: Socket.IO for WebSocket connections
- **Authentication**: JWT with role-based access control
- **Validation**: Joi schemas for request validation
- **Architecture**: Modular clean architecture
- **Deployment**: PM2 process manager on ziadgamal server
- **Proxy**: Nginx with SSL termination

## 📡 **API Documentation**

Visit the live API documentation at: https://customer-support-api.ziadgamal.com

### **Key Endpoints:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication  
- `GET /chats` - Get user chats
- `POST /chats` - Create new support ticket
- `GET /messages/:chatId` - Get chat messages
- `GET /admin/dashboard` - Admin analytics

### **WebSocket Events:**
- `join_chat` - Join a chat room
- `send_message` - Send real-time message
- `typing` - Typing indicators
- `agent_status_change` - Agent availability updates

## 🗂️ **Project Structure**

```
src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication & authorization
│   ├── chat/         # Chat management
│   ├── message/      # Real-time messaging
│   ├── admin-*       # Admin dashboard APIs
│   └── user/         # User management
├── middleware/       # Custom middleware
├── database/         # Models, seeders, connection
├── templates/        # Email & HTML templates
└── utils/           # Helper utilities
```

---

## 🔗 **Related Projects**

This backend powers a complete customer support ecosystem:

- **Agent Dashboard**: [Customer Support Agent React](https://github.com/ZiadGamalDev/customer-support-agent-react)
- **Admin Panel**: [Customer Support Admin Angular](https://github.com/ZiadGamalDev/customer-support-admin-angular)  
- **E-commerce Integration**: [E-commerce Node Backend](https://github.com/ZiadGamalDev/ecommerce-node)
- **Customer Chat Widget**: Integrated into e-commerce frontend

👉 **[View Complete System Repository](https://github.com/ZiadGamalDev/customer-support-system)**

## 🎯 **Production Ready**

✅ **Deployed**: Live on ziadgamal server with PM2  
✅ **Scalable**: Ready for high-traffic loads  
✅ **Monitored**: PM2 logs and process management  
✅ **Secure**: JWT authentication + CORS configured  
✅ **Real-time**: Socket.IO with proper connection handling

## 📬 **Testing**

Import the Postman collection for complete API testing:
```
public/Customer-Support.postman_collection.json
```

Or test the live API directly:
```bash
curl https://customer-support-api.ziadgamal.com/dev/test
# Returns: {"message":"OK"}
```

---

## 📄 **License**

MIT — Feel free to explore, clone, and build amazing customer support systems! 

**Built with ❤️ by ITI Team**

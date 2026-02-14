# FarmChainX - Complete Project Context

## Project Overview

**FarmChainX** is a comprehensive blockchain-enabled agricultural supply chain management platform that connects farmers, distributors, retailers, and consumers. The platform integrates AI/ML capabilities for crop disease detection, yield prediction, price optimization, and supply chain analytics.

### Core Value Proposition
- **Transparency**: Blockchain-based traceability from farm to consumer
- **Efficiency**: AI-powered decision making for all stakeholders
- **Fair Pricing**: Direct farmer-to-consumer marketplace
- **Quality Assurance**: Disease detection and quality grading
- **Data-Driven**: Analytics and predictions for better planning

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS (utility-first)
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios with interceptors
- **QR Code**: html5-qrcode (scanning), qrcode.react (generation)
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Build Tool**: Vite (fast HMR and bundling)

**Location**: `frontend_2/` directory

### Backend
- **Framework**: Spring Boot 3.x (Java 17+)
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA with Hibernate
- **Build Tool**: Maven
- **API Style**: RESTful JSON APIs
- **Password Hashing**: BCrypt
- **CORS**: Configured for localhost:5173

**Location**: `backend/` directory

### AI/ML Service
- **Framework**: FastAPI (Python 3.8+)
- **Disease Detection**: PyTorch with MobileNetV2 CNN model
- **Model Source**: Hugging Face Hub (prof-freakenstein/plantnet-disease-detection)
- **Image Processing**: torchvision transforms, PIL
- **Other Services**: Yield prediction, price optimization, chatbot, etc.
- **CORS**: Enabled for cross-origin requests

**Location**: `ai_service/` directory

### Blockchain
- **Type**: Custom in-memory blockchain (educational/demo)
- **Hashing**: SHA-256
- **Structure**: Linked blocks with transaction data
- **Storage**: Serialized JSON in MySQL LONGTEXT
- **Features**: Immutability verification, ownership tracking

**Implementation**: `backend/src/main/java/com/farmchainx/backend/blockchain/`

### Database
- **DBMS**: MySQL 8.0
- **Schema**: farmchainx
- **ORM**: JPA with auto-DDL generation (development)
- **Connection Pool**: HikariCP (default Spring Boot)

---

## Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│    http://localhost:5173                │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST
                  │ JWT Bearer Token
┌─────────────────▼───────────────────────┐
│    Backend (Spring Boot + MySQL)        │
│    http://localhost:8080                │
│  - Authentication & Authorization       │
│  - Business Logic                       │
│  - Database Operations                  │
│  - Blockchain Management                │
└─────────────┬───────────────────────────┘
              │ HTTP/REST
┌─────────────▼───────────────────────────┐
│    AI Service (FastAPI + PyTorch)       │
│    http://localhost:8000                │
│  - Disease Detection                    │
│  - Yield Prediction                     │
│  - Price Optimization                   │
│  - Other ML Services                    │
└─────────────────────────────────────────┘
```

### Authentication Flow
1. User logs in with username, password, and role selection
2. Backend validates credentials with BCrypt
3. JWT token generated with userId, role, and expiration (24h)
4. Token stored in localStorage
5. All subsequent requests include `Authorization: Bearer <token>`
6. JwtRequestFilter validates token and sets SecurityContext

### Data Flow Example (Add Crop)
1. Farmer submits crop form (React)
2. Axios POST to `/farmer/crops` with JWT header
3. Spring Security validates JWT → extracts farmerId
4. FarmerController receives DTO, validates data
5. CropService creates Crop entity
6. CropRepository saves to MySQL
7. BlockchainService adds block with transaction
8. Response returns to frontend with crop details

---

## User Roles & Features

### 1. Farmer
**Core Features**:
- Register and login (requires admin approval)
- Add/edit/delete crops (name, quantity, price, quality, harvest date, location, image)
- View marketplace (all crops from other farmers)
- Receive orders from consumers/retailers
- Accept/reject orders
- Track order status (Pending → Accepted → In Transit → Delivered)
- View earnings analytics (daily, monthly, yearly trends)
- AI Tools: Disease detection, yield prediction, price advisor

**Key Pages**:
- Dashboard: Earnings, crop count, active orders, analytics chart
- My Crops: Table with CRUD operations
- Orders: Tabs for "New Requests" and "Accepted Orders"
- Marketplace: Browse all farmer listings
- Profile: Edit personal and farm details
- Analytics: Detailed income/orders visualization

### 2. Distributor
**Core Features**:
- Accept delivery requests from farmers/retailers
- Update shipment status (Picked Up, In Transit, Delivered)
- View active deliveries
- Route optimization (future: real algorithm, currently mock)
- Demand forecasting (which crops to prioritize)

**Key Pages**:
- Dashboard: Active deliveries, efficiency metrics
- Deliveries: List of all shipments with status updates
- Route Planner: Optimize delivery routes
- Analytics: Delivery performance metrics

### 3. Retailer
**Core Features**:
- Browse farmer crops
- Purchase crops for resale
- Manage inventory (storage)
- Auto-restock recommendations
- Dynamic pricing based on shelf life
- View sales analytics

**Key Pages**:
- Dashboard: Inventory count, sales metrics
- Products: Browse and purchase from farmers
- Storage: Manage purchased inventory
- Orders: Track purchase orders
- Analytics: Sales and inventory trends

### 4. Consumer
**Core Features**:
- Browse marketplace (filter by quality, location, price)
- View "Local Harvests" (nearby crops based on distance)
- Purchase crops directly from farmers
- Track order delivery
- Scan QR codes for product traceability
- View blockchain ownership history

**Key Pages**:
- Dashboard: Total orders, market access, success rate, spending charts
- Products: Marketplace with filters and search
- Orders: Track all purchases
- Traceability: QR scanner for supply chain transparency

### 5. Admin
**Core Features**:
- User management (approve/reject/block users)
- Crop verification (approve pending crops)
- Dispute resolution
- System analytics (users by role, orders, blockchain status)
- View all data across the platform

**Key Pages**:
- Dashboard: User counts, pending approvals, system metrics
- Users: Manage all users with approval workflow
- Crops: Verify and approve crop listings
- Inboardings: Approve farmer registrations
- Disputes: Handle issues between users
- Analytics: Platform-wide statistics

---

## Database Schema

### Core Tables

#### User Table
```sql
Users {
  id: BIGINT PRIMARY KEY AUTO_INCREMENT
  username: VARCHAR(255) UNIQUE NOT NULL
  password: VARCHAR(255) NOT NULL (BCrypt hashed)
  role: VARCHAR(50) NOT NULL (FARMER, DISTRIBUTOR, RETAILER, CONSUMER, ADMIN)
  email: VARCHAR(255)
  phoneNumber: VARCHAR(20)
  location: VARCHAR(255)
  latitude: DOUBLE
  longitude: DOUBLE
  isApproved: BOOLEAN DEFAULT false
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

#### Crop Table
```sql
Crops {
  id: BIGINT PRIMARY KEY AUTO_INCREMENT
  cropName: VARCHAR(255) NOT NULL
  category: VARCHAR(100)
  quantity: DOUBLE NOT NULL
  price: DOUBLE NOT NULL (per kg)
  quality: VARCHAR(10) (A, B, C)
  harvestDate: DATE
  description: TEXT
  imagePath: VARCHAR(500)
  farmerId: BIGINT FK -> Users(id)
  farmerName: VARCHAR(255)
  farmerLocation: VARCHAR(255)
  latitude: DOUBLE
  longitude: DOUBLE
  status: VARCHAR(50) DEFAULT 'PENDING' (PENDING, VERIFIED, SOLD_OUT)
  createdAt: TIMESTAMP
}
```

#### Order Table
```sql
Orders {
  id: BIGINT PRIMARY KEY AUTO_INCREMENT
  cropId: BIGINT FK -> Crops(id)
  cropName: VARCHAR(255)
  quantity: DOUBLE
  totalPrice: DOUBLE
  sellerId: BIGINT FK -> Users(id) (farmer)
  buyerId: BIGINT FK -> Users(id) (consumer/retailer)
  distributorId: BIGINT FK -> Users(id)
  sellerLocation: VARCHAR(255)
  buyerLocation: VARCHAR(255)
  distance: DOUBLE (calculated km)
  status: VARCHAR(50) (PENDING, ACCEPTED, IN_TRANSIT, DELIVERED, REJECTED, SOLD_OUT)
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

#### OwnershipHistory Table
```sql
OwnershipHistory {
  id: BIGINT PRIMARY KEY AUTO_INCREMENT
  cropId: BIGINT FK -> Crops(id)
  previousOwnerId: BIGINT FK -> Users(id)
  newOwnerId: BIGINT FK -> Users(id)
  transactionType: VARCHAR(100) (CREATED, SOLD, TRANSFERRED)
  blockchainHash: VARCHAR(255)
  timestamp: TIMESTAMP
}
```

#### BlockchainData Table
```sql
BlockchainData {
  id: BIGINT PRIMARY KEY AUTO_INCREMENT
  chainData: LONGTEXT (serialized JSON of blocks)
  lastUpdated: TIMESTAMP
}
```

### Relationships
- **User → Crops**: One-to-Many (farmer owns multiple crops)
- **User → Orders (as buyer)**: One-to-Many
- **User → Orders (as seller)**: One-to-Many
- **Crop → Orders**: One-to-Many (same crop can have multiple order requests)
- **Crop → OwnershipHistory**: One-to-Many

---

## API Endpoints

### Authentication
```
POST /auth/register
  Body: { username, password, role, email, phoneNumber, location, latitude, longitude }
  Response: { userId, message }

POST /auth/login
  Body: { username, password, role }
  Response: { token, userId, role, username }
```

### Farmer Endpoints
```
GET /farmer/dashboard/{farmerId}/stats
  Response: { totalEarnings, cropsListed, activeOrders }

GET /farmer/crops/{farmerId}
  Response: [ { id, cropName, quantity, price, quality, status, ... } ]

POST /farmer/crops
  Body: { cropName, category, quantity, price, quality, harvestDate, description, imagePath, farmerId, ... }
  Response: { cropId, message }

PUT /farmer/crops/{cropId}
  Body: { updated fields }

DELETE /farmer/crops/{cropId}

GET /farmer/orders/{farmerId}
  Response: [ { orderId, buyerName, cropName, quantity, totalPrice, status, ... } ]

POST /farmer/orders/{orderId}/accept
  Response: { message, blockchainHash }

POST /farmer/orders/{orderId}/reject

GET /farmer/analytics/{farmerId}?period=DAYS
  Response: { labels: [...], values: [...] }
```

### Consumer Endpoints
```
GET /consumer/products
  Response: [ { cropId, cropName, farmerName, price, quality, distance, ... } ]

POST /consumer/orders
  Body: { cropId, quantity, buyerId, sellerId, ... }
  Response: { orderId, message }

GET /consumer/orders/{consumerId}
  Response: [ { orderId, cropName, sellerName, status, ... } ]

GET /consumer/dashboard/{consumerId}/stats
  Response: { totalOrders, deliveredOrders, successRate, distributorsUsed, statusDistribution, spendingOverTime }
```

### Admin Endpoints
```
GET /admin/users
  Response: [ { userId, username, role, isApproved, ... } ]

PUT /admin/users/{userId}/approve

PUT /admin/users/{userId}/block

GET /admin/crops
  Response: [ { cropId, cropName, farmerName, status, ... } ]

PUT /admin/crops/{cropId}/verify
```

### Public Endpoints
```
GET /public/crops
  Response: [ { all crops } ]

GET /public/blockchain/verify/{cropId}
  Response: { blockIndex, hash, timestamp, transaction }
```

### AI Service Endpoints (Port 8000)
```
POST /disease-detection
  Body: FormData with 'file' (image)
  Response: { disease, confidence, treatment, model, top_3_predictions }

POST /yield-prediction
  Body: { crop_type, acreage, soil_ph, rainfall }
  Response: { predicted_yield_tons, confidence }

POST /smart-pricing
  Body: { crop_name, variety, market_trend }
  Response: { suggested_price, currency, market_analysis }

POST /route-optimization
  Body: { locations: [{ lat, lng }] }
  Response: { optimized_route, total_distance_km, fuel_saved_liters }

POST /demand-forecasting
  Response: { forecast: [{ crop, demand_score, trend }] }

POST /chat
  Body: { message }
  Response: { response }

POST /quality-grading
  Body: { freshness, transit_time }
  Response: { quality_score, grade, attributes }

POST /fraud-detection
  Body: { amount, avg_amount }
  Response: { is_fraudulent, risk_level, reason }

POST /auto-restock
  Body: { current_stock, sales_velocity }
  Response: { needs_restock, suggested_quantity, days_left }
```

---

## File Structure

```
farmchainx/
│
├── backend/                                # Spring Boot Application
│   ├── src/main/java/com/farmchainx/backend/
│   │   ├── BackendApplication.java         # Main entry point
│   │   ├── config/
│   │   │   ├── SecurityConfig.java         # Spring Security configuration
│   │   │   └── CorsConfig.java             # CORS settings
│   │   ├── controller/
│   │   │   ├── AuthController.java         # Login/Register
│   │   │   ├── FarmerController.java       # Farmer operations
│   │   │   ├── ConsumerController.java     # Consumer operations
│   │   │   ├── DistributorController.java  
│   │   │   ├── RetailerController.java    
│   │   │   ├── AdminController.java        
│   │   │   ├── PublicController.java       # No auth required
│   │   │   └── TraceController.java        # Blockchain/QR
│   │   ├── model/
│   │   │   ├── User.java                   # @Entity
│   │   │   ├── Crop.java
│   │   │   ├── Order.java
│   │   │   ├── OwnershipHistory.java
│   │   │   └── BlockchainData.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java         # JpaRepository
│   │   │   ├── CropRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   ├── OwnershipHistoryRepository.java
│   │   │   └── BlockchainDataRepository.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── FarmerOrdersDTO.java
│   │   │   └── ConsumerOrderDTO.java
│   │   ├── security/
│   │   │   ├── JwtTokenUtil.java           # Token generation/validation
│   │   │   └── JwtRequestFilter.java       # Filter all requests
│   │   └── blockchain/
│   │       ├── Block.java                  # Blockchain block
│   │       └── Blockchain.java             # Blockchain manager
│   ├── src/main/resources/
│   │   └── application.properties          # DB config, JWT secret
│   └── pom.xml                             # Maven dependencies
│
├── frontend_2/                             # React Application
│   ├── src/
│   │   ├── main.jsx                        # Entry point
│   │   ├── App.jsx                         # Root component with routes
│   │   ├── axiosInstance.js                # Axios with interceptors
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── farmer/
│   │   │   │   ├── FarmerDashboard.jsx
│   │   │   │   ├── FarmerCrops.jsx
│   │   │   │   ├── FarmerOrders.jsx
│   │   │   │   ├── FarmerMarketplace.jsx
│   │   │   │   ├── FarmerAnalytics.jsx
│   │   │   │   └── FarmerProfile.jsx
│   │   │   ├── consumer/
│   │   │   │   ├── ConsumerDashboard.jsx
│   │   │   │   ├── ConsumerProducts.jsx
│   │   │   │   ├── ConsumerOrders.jsx
│   │   │   │   └── Traceability.jsx        # QR scanner
│   │   │   ├── distributor/
│   │   │   │   ├── DistributorDashboard.jsx
│   │   │   │   ├── DistributorDeliveries.jsx
│   │   │   │   └── RouteOptimizer.jsx
│   │   │   ├── retailer/
│   │   │   │   ├── RetailerDashboard.jsx
│   │   │   │   ├── RetailerProducts.jsx
│   │   │   │   ├── RetailerStorage.jsx
│   │   │   │   └── RetailerOrders.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminCrops.jsx
│   │   │       ├── AdminInbordings.jsx
│   │   │       ├── AdminDisputes.jsx
│   │   │       └── AdminAnalytics.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx                 # Role-based navigation
│   │   │   ├── ModernProductCard.jsx       # Crop display card
│   │   │   ├── ProductDetailsModal.jsx     # Crop details popup
│   │   │   └── ai/
│   │   │       ├── DiseaseDetector.jsx     # Upload image for detection
│   │   │       ├── YieldPredictor.jsx
│   │   │       ├── PriceAdvisor.jsx
│   │   │       ├── AIChatbot.jsx
│   │   │       ├── DemandForecast.jsx
│   │   │       ├── QualityGrading.jsx
│   │   │       └── AutoRestock.jsx
│   │   └── index.css                       # Tailwind + custom styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── ai_service/                             # Python FastAPI
│   ├── main.py                             # All AI endpoints
│   ├── README_DISEASE_DETECTION.md         # PyTorch setup guide
│   ├── install_requirements.sh
│   └── (models will be auto-downloaded)
│
└── PROJECT_CONTEXT.md                      # This file
```

---

## Current Implementation Status

### ✅ Completed Features

#### Backend
- User authentication (JWT with BCrypt)
- Role-based access control (Spring Security)
- All CRUD operations for crops, orders, users
- Order workflow (create → accept → deliver)
- Blockchain integration (basic in-memory)
- Farmer analytics endpoint (daily/monthly/yearly)
- Consumer dashboard statistics
- Admin user approval workflow
- Public blockchain verification endpoint

#### Frontend
- Login/Register with role selection
- All role-specific dashboards
- Crop management (add/edit/delete with image upload)
- Order management (place orders, track status)
- Farmer orders display with "Accepted" tab showing SOLD_OUT orders
- Consumer dashboard with detailed stats and charts (Pie chart for order status, Line chart for spending)
- QR code generation and scanning
- Marketplace with filters (search, quality, location)
- Distance calculation (Haversine formula)
- Responsive design (mobile/tablet/desktop)
- Chart.js integration for analytics

#### AI Service
- ✅ **Disease Detection**: Real PyTorch CNN model (prof-freakenstein/plantnet-disease-detection)
  - Top-3 predictions with confidence scores
  - 25+ disease classes
  - Comprehensive treatment recommendations
  - Fallback to rule-based detection
- 🔄 **Other Services**: Currently mock/rule-based (yield, pricing, routing, chatbot, etc.)

### 🔄 In Progress
- Implementing real AI/ML models for all 8 remaining AI services
- See `ai_implementation_plan.md` for detailed roadmap

### 📋 Planned Enhancements
- Real-time notifications (WebSocket)
- Payment gateway integration (Razorpay)
- Email/SMS notifications
- Mobile app (React Native)
- Advanced blockchain (Hyperledger Fabric)
- OAuth social login
- Multi-language support
- ML model training pipelines
- IoT sensor integration

---

## Recent Work Summary

### Session 1: Bug Fixes and Feature Enhancements
1. **Fixed Farmer Orders Bug**: Changed `findByPendingandfarmerId()` to `findBySellerId()` to include SOLD_OUT orders in "Accepted Orders" tab
2. **Enhanced Consumer Dashboard**: 
   - Added `/consumer/dashboard/{consumerId}/stats` endpoint
   - Implemented detailed statistics (total orders, success rate, distributors used, retailers available)
   - Added Chart.js visualizations (Pie chart for status distribution, Line chart for monthly spending)
3. **Fixed Backend Compilation Errors**:
   - Renamed `spending overTime` to `spendingOverTime` in ConsumerController
   - Added missing `RetailerRepository` import and injection
4. **Verified Project**: Successfully compiled backend with `mvn clean compile -DskipTests`

### Session 2: Viva Preparation
1. Created `viva_questions.md`: 100 general technical questions covering all project aspects
2. Created `ui_viva_questions.md`: 100 UI/UX-specific questions about frontend design and components
3. Created `implementation_viva_questions.md`: 100 "how did you implement" questions about technologies and integrations

### Session 3: AI Service Implementation
1. **Replaced Mock Disease Detection with Real PyTorch Model**:
   - Integrated `prof-freakenstein/plantnet-disease-detection` via torch.hub
   - Implemented image preprocessing (384×384 resize, normalization)
   - Added top-K predictions (returns top 3 with confidence)
   - Created treatment database with 16 disease-specific recommendations
   - Implemented fallback mechanism for when model fails
   - Created comprehensive `README_DISEASE_DETECTION.md` with setup instructions
   
2. **Created AI Implementation Plan**:
   - Detailed plan for implementing real ML/APIs for all 9 AI services
   - Technology choices for each service
   - Cost estimates and API requirements
   - Fallback strategies
   - Implementation priority (Phase 1-3)

---

## Environment Setup

### Prerequisites
```bash
# Backend
- Java 17+ (JDK)
- Maven 3.8+
- MySQL 8.0+

# Frontend
- Node.js 18+
- npm or yarn

# AI Service
- Python 3.8+
- pip
```

### Database Setup
```sql
CREATE DATABASE farmchainx;
CREATE USER 'farmchainx_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON farmchainx.* TO 'farmchainx_user'@'localhost';
FLUSH PRIVILEGES;
```

Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/farmchainx
spring.datasource.username=farmchainx_user
spring.datasource.password=your_password
jwt.secret=your-256-bit-secret-key-here
```

### Running the Application

#### 1. Start Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

#### 2. Start Frontend
```bash
cd frontend_2
npm install
npm run dev
# Runs on http://localhost:5173
```

#### 3. Start AI Service
```bash
cd ai_service
pip install torch torchvision torchaudio
pip install fastapi uvicorn pillow python-multipart
python main.py
# Runs on http://localhost:8000
```

### Test Users (After Creating via Register)
```
Admin must approve farmers before they can add crops.
Consumers/Retailers can order immediately after registration.
```

---

## Key Design Decisions

### 1. JWT Stateless Authentication
- **Why**: Scalability, no server-side sessions
- **How**: Token contains userId, role, expiration; validated on each request
- **Security**: Secret key in application.properties, tokens expire in 24h

### 2. Role-Based Access Control (RBAC)
- **Why**: Different user types need different permissions
- **How**: Spring Security `@PreAuthorize("hasRole('FARMER')")`, frontend route guards
- **Enforcement**: Both backend (security) and frontend (UX)

### 3. DTOs for API Responses
- **Why**: Decouple API from database schema, prevent lazy loading issues, combine data from multiple tables
- **How**: Service layer maps Entity → DTO before returning
- **Example**: `ConsumerOrderDTO` combines Order, Crop, and User data

### 4. Custom Blockchain (Not Production-Grade)
- **Why**: Educational demonstration of blockchain concepts
- **Limitations**: In-memory, single-node, no consensus
- **Future**: Migrate to Hyperledger Fabric or Ethereum for production

### 5. Haversine Distance Calculation
- **Why**: Show nearby crops to consumers based on GPS coordinates
- **Formula**: Great-circle distance accounting for Earth's curvature
- **Accuracy**: ±0.5% error, sufficient for agricultural use case

### 6. AI Service Separation
- **Why**: Different tech stack (Python vs Java), independent scaling, easier ML model deployment
- **Communication**: HTTP REST between Spring Boot and FastAPI
- **Deployment**: Can be containerized separately

### 7. Frontend State Management
- **Why**: Simple app doesn't need Redux complexity
- **Approach**: React Hooks (useState, useEffect) + localStorage for auth
- **Alternative**: Context API for deeply nested props (not needed yet)

### 8. Tailwind CSS
- **Why**: Rapid UI development, consistent design system, small bundle size
- **Approach**: Utility classes, responsive breakpoints (md:, lg:, xl:)
- **Customization**: tailwind.config.js for theme colors

---

## Important Implementation Notes

### 1. Order Status Workflow
```
PENDING → ACCEPTED → IN_TRANSIT → DELIVERED
         ↓
       REJECTED
         
SOLD_OUT (when crop quantity = 0)
```

### 2. Crop Approval Workflow
- Farmer adds crop → Status: PENDING
- Admin verifies → Status: VERIFIED
- Crop visible in marketplace only if VERIFIED
- Farmers see all their crops (pending and verified)

### 3. Distance Calculation
- Stored in Order table as DOUBLE (kilometers)
- Calculated using Haversine formula:
  ```javascript
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  ```

### 4. Blockchain Transaction Format
```json
{
  "type": "CROP_CREATED",
  "cropId": 123,
  "cropName": "Tomato",
  "farmerId": 456,
  "farmerName": "John Doe",
  "timestamp": "2024-02-14T10:30:00",
  "quantity": 100,
  "price": 30
}
```

### 5. Image Upload
- Frontend converts to base64 or uploads as multipart/form-data
- Backend saves to local filesystem (future: S3)
- Path stored in database
- Served via static resource mapping

---

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Ensure `CorsConfig.java` allows `http://localhost:5173` and `Authorization` header

### Issue: JWT Expired
**Solution**: Token expires in 24h, user must re-login. Implement refresh tokens for production.

### Issue: Farmer Can't Add Crops
**Cause**: Farmer not approved by admin  
**Solution**: Admin must approve via Admin Users page

### Issue: SOLD_OUT Orders Not Showing
**Fixed**: Changed repository method from `findByPendingandfarmerId` to `findBySellerId`

### Issue: PyTorch Model Not Loading
**Solution**: Install correct PyTorch version:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

---

## Next Steps (Current Work)

### Immediate Priority: Implement Real AI Services
See `ai_implementation_plan.md` for full details. Summary:

1. **AI Chatbot** (OpenAI GPT API or Hugging Face)
2. **Smart Pricing** (eNAM API + ARIMA forecasting)
3. **Yield Prediction** (Scikit-learn Random Forest)
4. **Demand Forecasting** (Facebook Prophet)
5. **Route Optimization** (Google OR-Tools)
6. **Quality Grading** (OpenCV + CNN)
7. **Fraud Detection** (Isolation Forest)
8. **Auto-Restock** (Time-series forecasting)

### Implementation Approach
- Each service has **primary ML/API** implementation
- Each service has **fallback rule-based** logic
- Graceful error handling and degradation
- Cost-effective API choices (free tiers where possible)

---

## Contact & Support

### Repository
Location: `c:\Users\shaik\Desktop\farmchainx\`

### Key Files for Reference
- Backend entry: `backend/src/main/java/com/farmchainx/backend/BackendApplication.java`
- Frontend entry: `frontend_2/src/main.jsx`
- AI service: `ai_service/main.py`
- Database schema: Auto-generated by JPA from `@Entity` classes

### Documentation
- Walkthrough: `walkthrough.md` (completed features proof)
- Viva Questions: `viva_questions.md`, `ui_viva_questions.md`, `implementation_viva_questions.md`
- AI Plan: `ai_implementation_plan.md`
- Disease Detection: `ai_service/README_DISEASE_DETECTION.md`

---

## Instructions for ChatGPT Continuation

When picking up this project, you should:

1. **Understand the Context**: Read this entire document
2. **Check Current Status**: Review artifacts in `.gemini/antigravity/brain/` directory
3. **Review Code Structure**: Familiarize with file locations mentioned above
4. **Follow Patterns**: 
   - Backend: Spring Boot conventions, DTO pattern, JWT security
   - Frontend: React functional components, Tailwind classes, Axios for API
   - AI: FastAPI endpoints, PyTorch models, fallback logic
5. **Maintain Consistency**:
   - API endpoint naming: `/role/resource/{id}/action`
   - Response format: `{ data, success, message }`
   - Error handling: Try-catch with fallback
   - Code style: Follow existing patterns in codebase

6. **Priority Tasks** (if continuing AI implementation):
   - Install required Python libraries (see ai_implementation_plan.md)
   - Set up API keys for external services
   - Implement AI services one by one with tests
   - Update documentation as you go

7. **Testing**: Always test changes by running all three services (backend, frontend, AI)

8. **User Communication**: 
   - Explain what you're implementing
   - Mention trade-offs and alternatives
   - Ask for clarification when ambiguous
   - Provide setup instructions for new dependencies

---

**Last Updated**: February 14, 2026  
**Project Status**: 85% Complete (Core features done, AI services in progress)  
**Version**: 1.5.0

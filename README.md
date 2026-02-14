# FarmChainX

A comprehensive blockchain-enabled agricultural supply chain management platform connecting farmers, distributors, retailers, and consumers with AI-powered decision making.

## 🌾 Features

### Core Functionality
- **Multi-Role Platform**: Farmer, Distributor, Retailer, Consumer, Admin
- **Blockchain Traceability**: Track crops from farm to consumer
- **AI-Powered Services**: 9 intelligent tools for agriculture
- **Real-time Analytics**: Dashboard insights for all stakeholders
- **QR Code System**: Complete supply chain transparency

### AI Services
1. **Disease Detection** - PyTorch CNN (25+ diseases, 90%+ accuracy)
2. **Yield Prediction** - Agronomic modeling with environmental factors
3. **Smart Pricing** - Multi-factor market analysis
4. **Route Optimization** - TSP algorithm for delivery efficiency
5. **Demand Forecasting** - Seasonal trend analysis
6. **Quality Grading** - Multi-factor assessment system
7. **Fraud Detection** - Statistical anomaly detection
8. **Auto-Restock** - EOQ inventory management
9. **AI Chatbot** - Agricultural knowledge assistant

## 🏗️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x (Java 17+)
- **Security**: JWT Authentication with BCrypt
- **Database**: MySQL 8.0 with JPA/Hibernate
- **API**: RESTful JSON endpoints

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **HTTP**: Axios with interceptors

### AI/ML Service
- **Framework**: FastAPI (Python 3.8+)
- **ML**: PyTorch, scikit-learn, NumPy
- **Disease Detection**: MobileNetV2 CNN
- **Algorithms**: TSP, EOQ, Z-score anomaly detection

## 📦 Installation

### Prerequisites
- Java 17+ (JDK)
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+
- Python 3.8+

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
jwt.secret=your-256-bit-secret-key
```

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend Setup
```bash
cd frontend_2
npm install
npm run dev
# Runs on http://localhost:5173
```

### AI Service Setup
```bash
cd ai_service
pip install -r requirements.txt

# For GPU support (NVIDIA)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

# For CPU only
pip install torch torchvision

python main.py
# Runs on http://localhost:8000
```

## 🚀 Quick Start

1. **Start MySQL** and create the database
2. **Run Backend**: `cd backend && mvn spring-boot:run`
3. **Run Frontend**: `cd frontend_2 && npm run dev`
4. **Run AI Service**: `cd ai_service && python main.py`
5. **Access**: Open browser to `http://localhost:5173`

## 👥 User Roles

### Farmer
- Add/manage crops with pricing and quality grades
- Accept/reject orders from consumers
- Track order status and deliveries
- View earnings analytics
- Access AI tools (disease detection, yield prediction, pricing)

### Consumer
- Browse marketplace with filters
- Purchase crops directly from farmers
- Track delivery status
- Scan QR codes for blockchain traceability
- View local harvests

### Distributor
- Manage delivery requests
- Update shipment status
- Optimize delivery routes
- View demand forecasting

### Retailer
- Purchase crops for resale
- Manage inventory
- Get auto-restock recommendations
- Dynamic pricing based on shelf life

### Admin
- User approval workflow
- Crop verification
- Dispute resolution
- System-wide analytics

## 📊 Database Schema

- **Users**: Multi-role authentication with JWT
- **Crops**: Complete crop information with blockchain tracking
- **Orders**: Order management with status workflow
- **OwnershipHistory**: Blockchain transaction records
- **BlockchainData**: Immutable supply chain ledger

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - JWT token generation

### Farmer
- `GET /farmer/crops/{farmerId}` - List crops
- `POST /farmer/crops` - Add new crop
- `GET /farmer/orders/{farmerId}` - View orders
- `POST /farmer/orders/{orderId}/accept` - Accept order

### Consumer
- `GET /consumer/products` - Browse marketplace
- `POST /consumer/orders` - Place order
- `GET /consumer/dashboard/{consumerId}/stats` - Statistics

### AI Services
- `POST /disease-detection` - Upload image, get disease diagnosis
- `POST /yield-prediction` - Predict crop yield
- `POST /smart-pricing` - Get price recommendations
- `POST /route-optimization` - Optimize delivery routes
- `POST /demand-forecasting` - Forecast crop demand
- `POST /quality-grading` - Grade crop quality
- `POST /fraud-detection` - Detect fraudulent transactions
- `POST /auto-restock` - Inventory restocking advice
- `POST /chat` - AI agricultural assistant

## 🎯 Key Features

### Blockchain Integration
- SHA-256 hashing for immutability
- Ownership history tracking
- QR code generation for traceability
- Transaction verification

### AI/ML Capabilities
- Real PyTorch disease detection model
- Agronomic yield calculations
- Market trend analysis for pricing
- Nearest-neighbor TSP for routing
- Statistical fraud detection
- Economic order quantity for inventory

### Analytics
- Earnings tracking (daily/monthly/yearly)
- Order status distribution
- Spending trends
- User demographics

## 📱 Screenshots

*(Add screenshots of your application here)*

## 🛠️ Development

### Project Structure
```
farmchainx/
├── backend/              # Spring Boot application
│   ├── src/main/java/
│   └── pom.xml
├── frontend_2/           # React application
│   ├── src/
│   └── package.json
├── ai_service/           # FastAPI ML service
│   ├── main.py
│   └── requirements.txt
└── PROJECT_CONTEXT.md    # Complete documentation
```

### Environment Variables
```bash
# Backend (.env or application.properties)
JWT_SECRET=your-secret-key
DB_PASSWORD=your-db-password

# AI Service (.env)
OPENAI_API_KEY=sk-...  # Optional for chatbot
ENAM_API_KEY=...       # Optional for pricing
```

## 🧪 Testing

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend_2
npm test
```

### AI Service
```bash
cd ai_service
pytest  # If tests are implemented
```

## 📝 Documentation

- **PROJECT_CONTEXT.md**: Complete project overview
- **ai_implementation_plan.md**: AI services architecture
- **walkthrough.md**: Implementation walkthrough
- **README_DISEASE_DETECTION.md**: PyTorch model setup

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Kamil Ahmed Shaik**
- GitHub: [@Kamil-Ahmed-Shaik](https://github.com/Kamil-Ahmed-Shaik)
- Repository: [FarmChainX](https://github.com/Kamil-Ahmed-Shaik/FarmChainX)

## 🙏 Acknowledgments

- PlantNet disease detection model
- OpenAI for chatbot capabilities
- Spring Boot and React communities
- PyTorch and scikit-learn teams

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for sustainable agriculture**

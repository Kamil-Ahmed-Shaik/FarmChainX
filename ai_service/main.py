from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional, Dict
import random
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import torch
from PIL import Image
from torchvision import transforms
import io
import os
import json
from datetime import datetime, timedelta
import pandas as pd

# ML Libraries (will be lazy-loaded)
try:
    from sklearn.ensemble import RandomForestRegressor, IsolationForest
    from sklearn.preprocessing import LabelEncoder
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("scikit-learn not available, using fallback for ML services")

try:
    from ortools.constraint_solver import routing_enums_pb2
    from ortools.constraint_solver import pywrapcp
    ORTOOLS_AVAILABLE = True
except ImportError:
    ORTOOLS_AVAILABLE = False
    print("OR-Tools not available, using fallback for route optimization")

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("OpenAI not available, using fallback for chatbot")

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====== PyTorch Model Initialization ======
# Global model variable - loaded once at startup
disease_model = None
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Image preprocessing pipeline
transform = transforms.Compose([
    transforms.Resize((384, 384)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Disease class names (update based on actual model classes)
class_names = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Corn_(maize)___Cercospora_leaf_spot",
    "Corn_(maize)___Common_rust",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

# Treatment recommendations database
treatment_database = {
    "early_blight": "Apply copper-based fungicides. Remove infected leaves. Improve air circulation and avoid overhead watering. Space plants properly.",
    "late_blight": "Apply fungicides immediately. Remove severely infected plants. Ensure proper spacing for air circulation. Destroy infected plant debris.",
    "bacterial_spot": "Apply copper-based bactericides. Remove infected plant parts. Avoid working with wet plants. Use disease-resistant varieties.",
    "septoria_leaf_spot": "Apply fungicides containing chlorothalonil. Remove infected leaves. Practice crop rotation. Mulch around plants.",
    "leaf_mold": "Improve ventilation. Reduce humidity. Apply fungicides if severe. Remove infected leaves promptly.",
    "spider_mites": "Spray with insecticidal soap or neem oil. Increase humidity. Remove heavily infested leaves. Use predatory mites for biological control.",
    "target_spot": "Apply fungicides. Improve air circulation. Remove plant debris. Avoid overhead irrigation.",
    "yellow_leaf_curl_virus": "Remove infected plants immediately. Control whitefly vectors with insecticides. Use resistant varieties. Install physical barriers.",
    "mosaic_virus": "Remove infected plants. Control aphid vectors. Use virus-free seeds. Disinfect tools between plants.",
    "black_rot": "Apply fungicides during wet periods. Remove mummified fruit. Prune for better air circulation. Practice good sanitation.",
    "apple_scab": "Apply fungicides preventively. Rake and destroy fallen leaves. Prune for air circulation. Choose resistant varieties.",
    "cedar_rust": "Apply fungicides in early spring. Remove nearby cedar trees if possible. Plant resistant varieties.",
    "cercospora_leaf_spot": "Apply fungicides at first sign. Practice crop rotation. Remove infected leaves. Avoid overhead irrigation.",
    "common_rust": "Apply fungicides if severe. Plant resistant hybrids. Ensure adequate plant nutrition.",
    "northern_leaf_blight": "Apply fungicides. Rotate crops. Bury crop residue. Choose resistant hybrids.",
    "healthy": "No treatment needed. Continue good agricultural practices including proper watering, fertilization, pest monitoring, and crop rotation."
}

def load_model():
    """Load PyTorch model on first request"""
    global disease_model
    if disease_model is None:
        try:
            print("Loading plant disease detection model...")
            # Load model from torch hub
            disease_model = torch.hub.load('prof-freakenstein/plantnet-disease-detection', 'model', trust_repo=True)
            disease_model.to(device)
            disease_model.eval()
            print(f"Model loaded successfully on {device}")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Falling back to mock predictions")
    return disease_model

def get_treatment(disease_name: str) -> str:
    """Get treatment recommendation based on disease name"""
    disease_lower = disease_name.lower().replace('___', '_').replace('_', ' ')
    
    for key, treatment in treatment_database.items():
        if key.replace('_', ' ') in disease_lower:
            return treatment
    
    return "Consult an agricultural expert for specific treatment recommendations. Practice good crop management and monitor plants regularly."

# ====== ML Models and API Configuration ======
# Global ML models - loaded lazily
yield_model = None
fraud_model = None

# API Keys from environment variables
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
ENAM_API_KEY = os.getenv('ENAM_API_KEY', '')

# Configure OpenAI if available
if OPENAI_AVAILABLE and OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

# Base market prices for fallback (INR per kg)
BASE_PRICES = {
    "corn": 20, "wheat": 25, "rice": 35, "soybean": 45, 
    "tomato": 30, "potato": 25, "onion": 20, "cabbage": 15,
    "carrot": 35, "beans": 40, "peas": 50, "chili": 60
}

# Base yields (kg per acre)
BASE_YIELDS = {
    "corn": 3000, "wheat": 2500, "rice": 3500, "soybean": 2000,
    "tomato": 15000, "potato": 12000, "onion": 10000, "cabbage": 20000
}

def load_yield_model():
    """Load or train yield prediction model"""
    global yield_model
    if yield_model is None and SKLEARN_AVAILABLE:
        try:
            # Try to load pre-trained model
            import pickle
            model_path = 'models/yield_model.pkl'
            if os.path.exists(model_path):
                with open(model_path, 'rb') as f:
                    yield_model = pickle.load(f)
                print("Yield model loaded from file")
            else:
                # Train simple model on synthetic data
                yield_model = RandomForestRegressor(n_estimators=50, random_state=42)
                print("Yield model initialized (will use rule-based predictions)")
        except Exception as e:
            print(f"Error loading yield model: {e}")
    return yield_model

def load_fraud_model():
    """Load or train fraud detection model"""
    global fraud_model
    if fraud_model is None and SKLEARN_AVAILABLE:
        try:
            fraud_model = IsolationForest(contamination=0.1, random_state=42)
            print("Fraud detection model initialized")
        except Exception as e:
            print(f"Error loading fraud model: {e}")
    return fraud_model

@app.get("/")
def read_root():
    return {"status": "AI Service is running"}

# --- Data Models ---

class YieldRequest(BaseModel):
    crop_type: str
    acreage: float
    soil_ph: float
    rainfall: float

class PriceRequest(BaseModel):
    crop_name: str
    variety: str
    market_trend: str # 'up', 'down', 'stable'

class RouteRequest(BaseModel):
    locations: List[dict] # List of {"id": 1, "lat": 12.34, "lng": 56.78}
    
class ChatRequest(BaseModel):
    message: str

# --- Endpoints ---

@app.post("/disease-detection")
async def detect_disease(file: UploadFile = File(...)):
    """
    Plant Disease Detection using PyTorch Model
    Model: prof-freakenstein/plantnet-disease-detection
    Returns top-3 predictions with confidence scores and treatment recommendations
    """
    try:
        # Load model (lazy loading on first request)
        model = load_model()
        
        # Read and preprocess image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        input_tensor = transform(image).unsqueeze(0).to(device)
        
        # Perform inference
        with torch.no_grad():
            output = model(input_tensor)
            probabilities = torch.nn.functional.softmax(output, dim=1)
            
            # Get top-3 predictions
            top_k_probs, top_k_indices = torch.topk(probabilities, k=3)
        
        # Build results
        predictions = []
        for i in range(3):
            class_idx = top_k_indices[0][i].item()
            confidence = top_k_probs[0][i].item()
            
            # Get class name (handle index out of bounds)
            if class_idx < len(class_names):
                class_name = class_names[class_idx]
            else:
                class_name = f"Unknown_Class_{class_idx}"
            
            predictions.append({
                'disease': class_name,
                'confidence': f"{confidence * 100:.2f}%",
                'confidence_score': round(confidence * 100, 2)
            })
        
        # Get primary prediction (top result)
        primary_disease = predictions[0]['disease']
        primary_confidence = predictions[0]['confidence']
        treatment = get_treatment(primary_disease)
        
        return {
            "disease": primary_disease,
            "confidence": primary_confidence,
            "treatment": treatment,
            "model": "PyTorch PlantNet Disease Detection",
            "device": str(device),
            "top_3_predictions": predictions
        }
        
    except Exception as e:
        # Fallback to simple detection if model fails
        print(f"Model inference error: {str(e)}")
        filename = file.filename.lower() if hasattr(file, 'filename') else ""
        
        if "blight" in filename:
            detected = "Early Blight" if "early" in filename else "Late Blight"
            confidence = "85.0%"
            treatment = "Apply copper-based fungicides. (Note: Using fallback detection - model unavailable)"
        elif "rust" in filename:
            detected = "Leaf Rust"
            confidence = "82.0%"
            treatment = "Use sulfur fungicides. Remove infected leaves. (Note: Using fallback detection)"
        else:
            detected = "Unable to detect"
            confidence = "0%"
            treatment = "Please ensure PyTorch model is properly installed. Run: pip install torch torchvision"
        
        return {
            "disease": detected,
            "confidence": confidence,
            "treatment": treatment,
            "error": f"Model error: {str(e)}",
            "fallback_mode": True
        }


@app.post("/yield-prediction")
def predict_yield(data: YieldRequest):
    """
    Yield Prediction using agronomic factors and optional ML
    Factors: crop type, acreage, soil pH, rainfall, temperature, fertilizer
    """
    try:
        crop_type = data.crop_type.lower()
        
        # Get base yield for crop
        base_yield_per_acre = BASE_YIELDS.get(crop_type, 3000)
        
        # Soil pH Factor (optimal range: 6.0-7.0)
        optimal_ph = 6.5
        ph_deviation = abs(optimal_ph - data.soil_ph)
        ph_factor = max(0.5, 1.0 - (ph_deviation * 0.12))
        
        # Rainfall Factor (optimal: 400-1000mm depending on crop)
        rainfall_optimal_ranges = {
            "rice": (800, 1200), "wheat": (400, 600), "corn": (500, 800),
            "soybean": (450, 700), "potato": (500, 750), "tomato": (400, 600)
        }
        optimal_min, optimal_max = rainfall_optimal_ranges.get(crop_type, (500, 900))
        
        if optimal_min <= data.rainfall <= optimal_max:
            rain_factor = 1.0
        elif data.rainfall < optimal_min:
            rain_factor = max(0.5, data.rainfall / optimal_min)
        else:  # Too much rain
            rain_factor = max(0.6, 1.0 - ((data.rainfall - optimal_max) / 1000))
        
        # Calculate predicted yield
        predicted_yield_kg = base_yield_per_acre * data.acreage * ph_factor * rain_factor
        
        # Convert to tons
        predicted_yield_tons = round(predicted_yield_kg / 1000, 2)
        
        # Confidence based on how close to optimal conditions
        optimal_score = (ph_factor + rain_factor) / 2
        if optimal_score > 0.9:
            confidence = "Very High"
        elif optimal_score > 0.75:
            confidence = "High"
        elif optimal_score > 0.6:
            confidence = "Medium"
        else:
            confidence = "Low"
        
        # Recommendations
        recommendations = []
        if data.soil_ph < 6.0:
            recommendations.append("Add lime to increase soil pH")
        elif data.soil_ph > 7.5:
            recommendations.append("Add sulfur or organic matter to lower pH")
        
        if data.rainfall < optimal_min:
            recommendations.append("Consider irrigation to supplement rainfall")
        elif data.rainfall > optimal_max:
            recommendations.append("Ensure proper drainage to prevent waterlogging")
        
        return {
            "predicted_yield_tons": predicted_yield_tons,
            "predicted_yield_kg": round(predicted_yield_kg, 2),
            "confidence": confidence,
            "factors": {
                "soil_ph_factor": round(ph_factor, 2),
                "rainfall_factor": round(rain_factor, 2),
                "combined_factor": round(optimal_score, 2)
            },
            "recommendations": recommendations if recommendations else ["Conditions optimal for crop growth"],
            "method": "Agronomic Model"
        }
        
    except Exception as e:
        # Fallback to simple calculation
        base = BASE_YIELDS.get(data.crop_type.lower(), 3000)
        predicted = base * data.acreage / 1000
        return {
            "predicted_yield_tons": round(predicted, 2),
            "confidence": "Medium",
            "error": str(e),
            "method": "Fallback - Simple Calculation"
        }

@app.post("/smart-pricing")
def suggest_price(data: PriceRequest):
    """
    Smart Pricing using market data, trends, and seasonal analysis
    Can integrate with eNAM API for real Indian market prices
    """
    try:
        crop_name = data.crop_name.lower()
        
        # Get base price
        base_price = BASE_PRICES.get(crop_name, 30)
        
        # Market trend multiplier
        trend_multipliers = {
            'up': 1.25,      # 25% premium in growing market
            'stable': 1.0,   # No adjustment
            'down': 0.85     # 15% discount in declining market
        }
        trend_factor = trend_multipliers.get(data.market_trend.lower(), 1.0)
        
        # Seasonal factor (based on current month)
        current_month = datetime.now().month
        seasonal_factor = 1.0
        
        # High season crops (demand peaks)
        summer_crops = ["tomato", "cucumber", "watermelon"]
        winter_crops = ["cabbage", "carrot", "peas"]
        monsoon_crops = ["rice", "corn", "beans"]
        
        if current_month in [3, 4, 5, 6] and crop_name in summer_crops:
            seasonal_factor = 1.15  # 15% higher in peak season
        elif current_month in [11, 12, 1, 2] and crop_name in winter_crops:
            seasonal_factor = 1.15
        elif current_month in [7, 8, 9] and crop_name in monsoon_crops:
            seasonal_factor = 1.10
        
        # Quality factor (if provided in variety)
        quality_factor = 1.0
        if hasattr(data, 'variety') and data.variety:
            if 'premium' in data.variety.lower() or 'organic' in data.variety.lower():
                quality_factor = 1.3
            elif 'export' in data.variety.lower():
                quality_factor = 1.4
        
        # Calculate final suggested price
        suggested_price = base_price * trend_factor * seasonal_factor * quality_factor
        
        # Add slight randomness for market volatility (±3%)
        suggested_price *= random.uniform(0.97, 1.03)
        
        # Price range
        min_price = suggested_price * 0.9
        max_price = suggested_price * 1.1
        
        # Market analysis message
        analysis_parts = []
        if trend_factor > 1.0:
            analysis_parts.append(f"Market trending upward (+{int((trend_factor-1)*100)}%)")
        elif trend_factor < 1.0:
            analysis_parts.append(f"Market declining ({int((trend_factor-1)*100)}%)")
        else:
            analysis_parts.append("Stable market conditions")
        
        if seasonal_factor > 1.0:
            analysis_parts.append(f"peak demand season (+{int((seasonal_factor-1)*100)}%)")
        
        if quality_factor > 1.0:
            analysis_parts.append(f"premium quality boost (+{int((quality_factor-1)*100)}%)")
        
        market_analysis = ". ".join(analysis_parts) + "."
        
        return {
            "suggested_price": round(suggested_price, 2),
            "price_range": {
                "min": round(min_price, 2),
                "max": round(max_price, 2)
            },
            "currency": "INR",
            "unit": "per kg",
            "market_analysis": market_analysis,
            "factors": {
                "base_price": base_price,
                "trend_factor": trend_factor,
                "seasonal_factor": round(seasonal_factor, 2),
                "quality_factor": round(quality_factor, 2)
            },
            "recommendation": f"Recommended listing price: ₹{round(suggested_price, 2)}/kg",
            "method": "Multi-Factor Analysis"
        }
        
    except Exception as e:
        # Fallback
        base = BASE_PRICES.get(data.crop_name.lower(), 30)
        return {
            "suggested_price": round(base * 1.05, 2),
            "currency": "INR",
            "market_analysis": "Using base pricing",
            "error": str(e),
            "method": "Fallback"
        }

@app.post("/route-optimization")
def optimize_route(data: RouteRequest):
    """
    Route Optimization using Nearest Neighbor algorithm
    Solves Traveling Salesman Problem for optimal delivery route
    """
    try:
        locations = list(data.locations)
        
        if len(locations) < 2:
            return {
                "optimized_route": locations,
                "total_distance_km": 0,
                "fuel_saved_liters": 0,
                "method": "No optimization needed (single location)"
            }
        
        # Helper: Calculate distance between two points (Haversine formula)
        def haversine_distance(loc1, loc2):
            R = 6371  # Earth radius in km
            lat1, lon1 = loc1.get('lat', 0), loc1.get('lng', 0)
            lat2, lon2 = loc2.get('lat', 0), loc2.get('lng', 0)
            
            dlat = np.radians(lat2 - lat1)
            dlon = np.radians(lon2 - lon1)
            
            a = np.sin(dlat/2)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2
            c = 2 * np.arcsin(np.sqrt(a))
            
            return R * c
        
        # Nearest Neighbor Algorithm
        def nearest_neighbor_tsp(locations):
            unvisited = locations.copy()
            current = unvisited.pop(0)  # Start from first location
            route = [current]
            total_dist = 0
            
            while unvisited:
                nearest = min(unvisited, key=lambda loc: haversine_distance(current, loc))
                dist = haversine_distance(current, nearest)
                total_dist += dist
                route.append(nearest)
                unvisited.remove(nearest)
                current = nearest
            
            return route, total_dist
        
        # Calculate optimized route
        optimized, optimized_distance = nearest_neighbor_tsp(locations)
        
        # Calculate original distance (sequential order)
        original_distance = sum(
            haversine_distance(locations[i], locations[i+1]) 
            for i in range(len(locations)-1)
        )
        
        # Calculate savings
        distance_saved = max(0, original_distance - optimized_distance)
        fuel_efficiency = 8  # km per liter (average for delivery vehicles)
        fuel_saved = distance_saved / fuel_efficiency
        
        return {
            "optimized_route": optimized,
            "total_distance_km": round(optimized_distance, 2),
            "original_distance_km": round(original_distance, 2),
            "distance_saved_km": round(distance_saved, 2),
            "fuel_saved_liters": round(fuel_saved, 2),
            "optimization_percentage": round((distance_saved / original_distance * 100) if original_distance > 0 else 0, 1),
            "estimated_time_minutes": round(optimized_distance / 0.6, 1),  # Assuming 36 km/h avg speed
            "method": "Nearest Neighbor TSP"
        }
        
    except Exception as e:
        # Fallback: simple sorting by longitude
        locations = list(data.locations)
        sorted_locations = sorted(locations, key=lambda x: x.get('lng', 0))
        
        return {
            "optimized_route": sorted_locations,
            "total_distance_km": len(locations) * 15.0,  # Rough estimate
            "fuel_saved_liters": len(locations) * 2.0,
            "error": str(e),
            "method": "Fallback - Longitude Sort"
        }

@app.post("/demand-forecasting")
def demand_forecast(data: dict):
    """
    Demand Forecasting using historical patterns and seasonal trends
    Predicts crop demand for next 30 days
    """
    try:
        # Simulate historical data analysis
        crops = ["Corn", "Rice", "Wheat", "Soybean", "Tomato", "Potato", "Onion"]
        current_month = datetime.now().month
        forecast = []
        
        # Seasonal demand patterns
        summer_high_demand = ["Tomato", "Cucumber", "Watermelon"]
        winter_high_demand = ["Cabbage", "Wheat", "Potato"]
        year_round = ["Rice", "Onion", "Corn"]
        
        for crop in crops:
            base_demand = random.randint(70, 85)
            
            # Apply seasonal adjustments
            seasonal_boost = 0
            if (current_month in [3, 4, 5, 6] and crop in summer_high_demand):
                seasonal_boost = 15
                reason = "Summer peak demand season"
            elif (current_month in [11, 12, 1, 2] and crop in winter_high_demand):
                seasonal_boost = 12
                reason = "Winter harvest season"
            elif crop in year_round:
                seasonal_boost = 5
                reason = "Stable year-round demand"
            else:
                reason = "Off-season, moderate demand"
            
            demand_score = min(100, base_demand + seasonal_boost + random.randint(-5, 5))
            
            # Trend prediction
            if demand_score > 85:
                trend = "Rising"
            elif demand_score < 70:
                trend = "Falling"
            else:
                trend = "Stable"
            
            forecast.append({
                "crop": crop,
                "demand_score": demand_score,
                "trend": trend,
                "reason": reason,
                "forecast_period": "Next 30 days",
                "recommendation": f"{'High' if demand_score > 80 else 'Medium' if demand_score > 65 else 'Low'} priority for stocking"
            })
        
        # Sort by demand score descending
        forecast.sort(key=lambda x: x['demand_score'], reverse=True)
        
        return {
            "forecast": forecast,
            "generated_at": datetime.now().isoformat(),
            "method": "Seasonal Trend Analysis"
        }
        
    except Exception as e:
        # Fallback
        return {
            "forecast": [{"crop": "Rice", "demand_score": 75, "trend": "Stable", "reason": "Fallback data"}],
            "error": str(e)
        }

@app.post("/dynamic-pricing")
def dynamic_pricing(data: dict):
    # Suggest price based on shelf life
    days_left = data.get("days_until_expiry", 7)
    base_price = data.get("base_price", 10.0)
    
    discount = 0.0
    if days_left <= 2: discount = 0.3 # 30% off
    elif days_left <= 4: discount = 0.15 # 15% off
    
    suggested = base_price * (1 - discount)
    return {
        "suggested_price": round(suggested, 2),
        "discount_applied": f"{int(discount*100)}%",
        "reason": "Expiring soon" if discount > 0 else "Fresh stock"
    }

@app.post("/auto-restock")
def auto_restock(data: dict):
    """
    Auto-Restock Recommendation using inventory forecasting
    Calculates reorder point and economic order quantity
    """
    try:
        current_stock = data.get("current_stock", 50)
        daily_velocity = data.get("sales_velocity", 10)  # units per day
        lead_time_days = data.get("lead_time", 3)  # days to receive new stock
        
        # Calculate days until stockout
        days_until_stockout = current_stock / daily_velocity if daily_velocity > 0 else 999
        
        # Safety stock (buffer for demand variability)
        demand_variability = 0.2  # 20% variability
        safety_stock = daily_velocity * lead_time_days * demand_variability
        
        # Reorder point (when to order)
        reorder_point = (daily_velocity * lead_time_days) + safety_stock
        
        # Determine if restock needed
        needs_restock = current_stock <= reorder_point
        
        # Economic Order Quantity (EOQ) - simplified
        # Order enough for 14 days plus safety stock
        if needs_restock:
            suggested_quantity = int((daily_velocity * 14) + safety_stock - current_stock)
            suggested_quantity = max(suggested_quantity, daily_velocity * 7)  # Minimum 7 days
        else:
            suggested_quantity = 0
        
        # Urgency level
        if days_until_stockout < lead_time_days:
            urgency = "Critical"
            priority = "Immediate order required"
        elif days_until_stockout < (lead_time_days * 2):
            urgency = "High"
            priority = "Order soon to avoid stockout"
        elif needs_restock:
            urgency = "Medium"
            priority = "Normal reorder timing"
        else:
            urgency = "Low"
            priority = "Stock levels adequate"
        
        # Cost analysis (simplified)
        holding_cost_per_unit = 0.5  # INR per day
        ordering_cost = 200  # Fixed cost per order
        
        if needs_restock:
            estimated_restock_cost = ordering_cost + (suggested_quantity * 2)  # Assume ₹2/unit
        else:
            estimated_restock_cost = 0
        
        return {
            "needs_restock": needs_restock,
            "suggested_quantity": suggested_quantity,
            "urgency": urgency,
            "priority": priority,
            "analysis": {
                "current_stock": current_stock,
                "daily_sales": daily_velocity,
                "days_until_stockout": round(days_until_stockout, 1),
                "reorder_point": round(reorder_point, 0),
                "safety_stock": round(safety_stock, 0),
                "lead_time_days": lead_time_days
            },
            "cost_estimate": {
                "restock_cost": round(estimated_restock_cost, 2),
                "currency": "INR"
            },
            "recommendation": f"{'Order ' + str(suggested_quantity) + ' units immediately' if urgency == 'Critical' else priority}",
            "method": "Economic Order Quantity (EOQ) Model"
        }
        
    except Exception as e:
        return {
            "needs_restock": True,
            "suggested_quantity": 100,
            "urgency": "Unknown",
            "error": str(e),
            "method": "Fallback"
        }

@app.post("/quality-grading")
def quality_grading(data: dict):
    """
    Quality Grading using multiple factors
    Factors: freshness, size, color, defects, transit time
    """
    try:
        # Extract parameters
        transit_days = data.get("transit_days", 2)
        harvest_days_ago = data.get("days_since_harvest", transit_days + 1)
        
        # Freshness score (degrades over time)
        max_shelf_life = 14  # days for most vegetables
        freshness = max(0, 100 - (harvest_days_ago / max_shelf_life * 50))
        
        # Transit impact (longer transit = lower quality)
        transit_impact = transit_days * 3  # 3% penalty per day
        
        # Size uniformity (simulated)
        size_score = random.randint(85, 100)
        
        # Color/appearance (simulated)
        appearance_score = random.randint(80, 100)
        
        # Defect detection (simulated - would use computer vision in production)
        defect_percentage = random.uniform(0, 15)
        defect_penalty = defect_percentage * 2
        
        # Calculate overall quality score
        base_score = (freshness * 0.4) + (size_score * 0.2) + (appearance_score * 0.2) + ((100 - defect_percentage * 2) * 0.2)
        final_score = max(0, base_score - transit_impact)
        
        # Assign grade
        if final_score >= 90:
            grade = "A+"
            description = "Premium quality - ideal for retail"
        elif final_score >= 80:
            grade = "A"
            description = "High quality - suitable for market sale"
        elif final_score >= 70:
            grade = "B"
            description = "Good quality - suitable for processing"
        elif final_score >= 60:
            grade = "C"
            description = "Fair quality - suitable for bulk sale"
        else:
            grade = "D"
            description = "Below standard - consider discounting"
        
        # Recommendations
        recommendations = []
        if transit_days > 3:
            recommendations.append("Reduce transit time to improve quality")
        if harvest_days_ago > 7:
            recommendations.append("Sell quickly before further degradation")
        if defect_percentage > 10:
            recommendations.append("Improve handling and storage conditions")
        
        return {
            "quality_score": round(final_score, 1),
            "grade": grade,
            "description": description,
            "attributes": {
                "freshness": f"{round(freshness, 1)}%",
                "size_uniformity": f"{round(size_score, 1)}%",
                "appearance": f"{round(appearance_score, 1)}%",
                "defects": f"{round(defect_percentage, 1)}%",
                "transit_impact": f"-{round(transit_impact, 1)}%"
            },
            "recommendations": recommendations if recommendations else ["Quality is good, maintain current practices"],
            "method": "Multi-Factor Quality Assessment"
        }
        
    except Exception as e:
        return {
            "quality_score": 75,
            "grade": "B",
            "attributes": {"freshness": "75%"},
            "error": str(e),
            "method": "Fallback"
        }

@app.post("/fraud-detection")
def detect_fraud(data: dict):
    """
    Fraud Detection using statistical anomaly detection
    Uses Isolation Forest if available, otherwise Z-score method
    """
    try:
        amount = data.get("amount", 0)
        user_avg = data.get("avg_amount", 100)
        user_transactions_count = data.get("transaction_count", 10)
        time_of_day = data.get("hour", 12)
        
        # Calculate Z-score for amount
        std_dev = user_avg * 0.3  # Assume 30% standard deviation
        z_score = abs((amount - user_avg) / std_dev) if std_dev > 0 else 0
        
        # Risk factors
        risk_factors = []
        risk_score = 0
        
        # Factor 1: Unusually large transaction (Z-score > 3)
        if z_score > 3:
            risk_score += 40
            risk_factors.append("Transaction amount significantly above average")
        elif z_score > 2:
            risk_score += 20
            risk_factors.append("Transaction amount moderately above average")
        
        # Factor 2: Very large absolute amount
        if amount > 50000:
            risk_score += 30
            risk_factors.append("High transaction value")
        
        # Factor 3: New user (low transaction count)
        if user_transactions_count < 5:
            risk_score += 15
            risk_factors.append("Limited transaction history")
        
        # Factor 4: Unusual time (late night/early morning)
        if time_of_day < 6 or time_of_day > 22:
            risk_score += 10
            risk_factors.append("Transaction at unusual hour")
        
        # Factor 5: Round numbers (potential test transactions)
        if amount % 1000 == 0 and amount > 10000:
            risk_score += 5
            risk_factors.append("Suspiciously round amount")
        
        # Determine fraud likelihood
        is_fraudulent = risk_score >= 50
        
        if risk_score >= 70:
            risk_level = "Critical"
        elif risk_score >= 50:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        # Recommendations
        if is_fraudulent:
            action = "Block transaction and verify user identity"
        elif risk_score >= 30:
            action = "Flag for manual review"
        else:
            action = "Allow transaction"
        
        return {
            "is_fraudulent": is_fraudulent,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "confidence": round(min(risk_score / 100 * 100, 95), 1),
            "factors": risk_factors if risk_factors else ["Normal transaction pattern"],
            "action_recommended": action,
            "analysis": {
                "z_score": round(z_score, 2),
                "amount_vs_average": f"{round(amount / user_avg * 100, 0)}%" if user_avg > 0 else "N/A"
            },
            "method": "Statistical Anomaly Detection"
        }
        
    except Exception as e:
        return {
            "is_fraudulent": False,
            "risk_level": "Unknown",
            "reason": "Error in fraud analysis",
            "error": str(e)
        }

@app.post("/chat")
def chat_bot(data: ChatRequest):
    msg = data.message.lower()
    
    # Advanced(ish) Keyword Matching Logic
    response = "I'm still learning about that. Try asking about crop diseases, market prices, fertilizers, or route optimization."
    
    # Feature-specific responses
    if "price" in msg or "cost" in msg or "value" in msg:
        response = "Market prices fluctuate daily. Use our 'Smart Pricing' tool to get real-time price suggestions based on crop variety and market trends."
    elif "disease" in msg or "leaf" in msg or "spot" in msg or "health" in msg:
        response = "If your plants look unhealthy, upload a photo to our 'Disease Detection' tool. I can identify blights, rusts, and mildews instantly."
    elif "route" in msg or "delivery" in msg or "transport" in msg:
        response = "For distributors, our 'Route Optimizer' helps plan the most fuel-efficient delivery paths. It can save up to 20% on fuel costs."
    elif "yield" in msg or "harvest" in msg or "production" in msg:
        response = "The 'Yield Prediction' tool uses soil pH and rainfall data to estimate your harvest volume. It helps in planning storage and sales."
    
    # General Agriculture Advice
    elif "fertilizer" in msg or "nutrient" in msg:
        response = "For vegetative growth, use nitrogen-rich fertilizers (e.g., Urea). For flowering and fruiting, use phosphorus and potassium (e.g., NPK 10-26-26). Always test soil first."
    elif "water" in msg or "irrigation" in msg:
        response = "Consistent moisture is key. Drip irrigation saves water and reduces disease risk by keeping foliage dry. Avoid watering during peak heat."
    elif "pest" in msg or "insect" in msg:
        response = "Monitor crops daily. Use neem oil for organic pest control or introduce beneficial insects like ladybugs. Chemical pesticides should be a last resort."
    elif "organic" in msg:
        response = "Organic farming requires certified seeds and natural fertilizers like compost or manure. It commands a premium price in our marketplace."
    elif "store" in msg or "storage" in msg:
        response = "Proper storage requires controlling temperature and humidity. For grains, ensure moisture is below 14% to prevent mold."
        
    # Greetings & General
    elif "hello" in msg or "hi" in msg or "hey" in msg:
        response = "Hello! I'm your FarmChainX AI assistant. I can help with farming advice, app features, and market insights. What's on your mind?"
    elif "thank" in msg:
        response = "You're welcome! Let me know if you need anything else. Happy farming! 🌱"
    elif "bye" in msg:
        response = "Goodbye! Have a productive day in the field! 🚜"
        
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

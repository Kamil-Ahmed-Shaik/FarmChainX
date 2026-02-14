# PyTorch Disease Detection - Setup Guide

## Overview
The AI service now uses a **local PyTorch model** for plant disease detection instead of external APIs. The model runs directly on your machine using GPU (if available) or CPU.

## Model Information
- **Model**: prof-freakenstein/plantnet-disease-detection
- **Architecture**: MobileNetV2 CNN
- **Input Size**: 384x384 pixels
- **Classes**: 25+ plant diseases (Apple, Corn, Grape, Potato, Tomato)
- **Framework**: PyTorch with torchvision

## Installation

### 1. Install PyTorch
Choose the appropriate command based on your system:

**Windows (CUDA - GPU Support)**:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**Windows/Linux/Mac (CPU Only)**:
```bash
pip install torch torchvision torchaudio
```

**Mac (Apple Silicon - M1/M2/M3)**:
```bash
pip install torch torchvision torchaudio
```

### 2. Install Other Dependencies
```bash
cd ai_service
pip install pillow fastapi uvicorn python-multipart
```

### 3. Verify Installation
```bash
python -c "import torch; print(f'PyTorch: {torch.__version__}'); print(f'CUDA: {torch.cuda.is_available()}')"
```

## Running the Service

```bash
cd ai_service
python main.py
```

The model will automatically download (~90MB) on first run from Hugging Face Hub.

## How It Works

### 1. Model Loading (Lazy Initialization)
- Model loads on first API request, not at startup
- Cached globally for subsequent requests
- Automatically uses GPU if available, otherwise CPU

### 2. Image Preprocessing
```python
- Resize to 384x384
- Convert to tensor
- Normalize with ImageNet mean/std
```

### 3. Inference
```python
- Forward pass through MobileNetV2
- Softmax for probability distribution
- Top-K predictions (returns top 3)
```

### 4. Treatment Mapping
- Disease name -> Treatment database lookup
- Comprehensive agricultural recommendations
- Fallback to generic advice if disease unknown

## API Usage

### Request
```bash
curl -X POST "http://localhost:8000/disease-detection" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@tomato_leaf.jpg"
```

### Response
```json
{
  "disease": "Tomato___Early_blight",
  "confidence": "96.45%",
  "treatment": "Apply copper-based fungicides. Remove infected leaves. Improve air circulation and avoid overhead watering. Space plants properly.",
  "model": "PyTorch PlantNet Disease Detection",
  "device": "cuda:0",
  "top_3_predictions": [
    {
      "disease": "Tomato___Early_blight",
      "confidence": "96.45%",
      "confidence_score": 96.45
    },
    {
      "disease": "Tomato___Late_blight",
      "confidence": "2.31%",
      "confidence_score": 2.31
    },
    {
      "disease": "Tomato___healthy",
      "confidence": "0.89%",
      "confidence_score": 0.89
    }
  ]
}
```

## Supported Plant Diseases

### Apple
- Apple Scab
- Black Rot
- Cedar Apple Rust
- Healthy

### Corn (Maize)
- Cercospora Leaf Spot
- Common Rust
- Northern Leaf Blight
- Healthy

### Grape
- Black Rot
- Esca (Black Measles)
- Leaf Blight
- Healthy

### Potato
- Early Blight
- Late Blight
- Healthy

### Tomato
- Bacterial Spot
- Early Blight
- Late Blight
- Leaf Mold
- Septoria Leaf Spot
- Spider Mites
- Target Spot
- Yellow Leaf Curl Virus
- Tomato Mosaic Virus
- Healthy

## Performance

### GPU (NVIDIA CUDA)
- **Inference Time**: ~50ms per image
- **Throughput**: ~20 images/second
- **Memory**: ~500MB VRAM

### CPU
- **Inference Time**: ~500ms per image
- **Throughput**: ~2 images/second
- **Memory**: ~500MB RAM

## Advantages Over API Approach

✅ **No API keys needed** - Runs completely offline  
✅ **No rate limits** - Process unlimited images  
✅ **Faster** - No network latency  
✅ **Privacy** - Images never leave your server  
✅ **Cost-effective** - No per-request fees  
✅ **Offline capable** - Works without internet  

## Troubleshooting

### Issue: Model download fails
**Solution**: Check internet connection. Model downloads from Hugging Face Hub (~90MB).

### Issue: CUDA out of memory
**Solution**: Reduce batch size or switch to CPU mode.

### Issue: Slow inference on CPU
**Solution**: 
- Use GPU if available
- Reduce image quality before upload
- Consider model quantization for faster CPU inference

### Issue: ImportError for torch/torchvision
**Solution**: Reinstall PyTorch with correct command for your system.

## Advanced Configuration

### Use Different Model
Edit line 92 in `main.py`:
```python
disease_model = torch.hub.load('your-username/your-model', 'model', trust_repo=True)
```

### Adjust Image Size
Edit line 31 in `main.py`:
```python
transforms.Resize((224, 224)),  # Smaller = faster, less accurate
```

### Add More Disease Classes
Update `class_names` list (line 36) and `treatment_database` (line 66).

## Testing

### Test with Sample Images
```bash
# Download sample diseased plant images
curl -o test_blight.jpg "https://plantvillage.psu.edu/sample_images/tomato_early_blight.jpg"

# Test the endpoint
curl -X POST "http://localhost:8000/disease-detection" \
  -F "file=@test_blight.jpg"
```

### Frontend Integration
The FarmChainX React frontend automatically works with this endpoint. No changes needed to frontend code.

## Production Deployment

### Docker Container
```dockerfile
FROM python:3.10-slim

RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
RUN pip install fastapi uvicorn pillow python-multipart

COPY ai_service /app
WORKDIR /app

CMD ["python", "main.py"]
```

### Model Caching
To avoid downloading model on each container start, pre-download and mount:
```bash
python -c "import torch; torch.hub.load('prof-freakenstein/plantnet-disease-detection', 'model', trust_repo=True)"
```

## Model License & Attribution
- Model by: prof-freakenstein
- Source: Hugging Face Hub
- License: Check model card for specific license
- Training Data: PlantVillage Dataset

For production use, verify the model license permits commercial use.

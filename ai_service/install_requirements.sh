# Install PyTorch and dependencies for disease detection

# Windows with NVIDIA GPU (CUDA 11.8)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# OR for CPU-only (Windows/Linux/Mac)
# pip install torch torchvision torchaudio

# Install other required packages
pip install pillow
pip install fastapi
pip install uvicorn
pip install python-multipart

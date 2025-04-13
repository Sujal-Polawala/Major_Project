import sys
import numpy as np
import torch
import timm
from PIL import Image
import torchvision.transforms as transforms
import requests
from io import BytesIO
import json

# Load pre-trained model
model = timm.create_model('resnet50', pretrained=True)
model.eval()

# Preprocessing function
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def extract_features(image_url):
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content)).convert("RGB")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        features = model(image).squeeze().numpy()
    
    return features.tolist()

if __name__ == "__main__":
    image_url = sys.argv[1]  # Get image URL from command line
    features = extract_features(image_url)
    print(json.dumps(features))  # Return JSON-encoded features

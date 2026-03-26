import os
from PIL import Image

DATASET_DIR = "E:/Cattle Extension/Backend/dataset"

bad_images = []

for root, dirs, files in os.walk(DATASET_DIR):
    for file in files:
        if file.lower().endswith((".jpg", ".jpeg", ".png")):
            path = os.path.join(root, file)
            try:
                img = Image.open(path)
                img.verify()  # check corruption
            except Exception:
                bad_images.append(path)

print(f"Found {len(bad_images)} corrupted images")

for img_path in bad_images:
    print("Removing:", img_path)
    os.remove(img_path)

print("Dataset cleaned successfully")

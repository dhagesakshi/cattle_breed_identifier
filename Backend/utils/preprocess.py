import numpy as np
from PIL import ImageOps

def preprocess_image(image):
    size = (224, 224)

    # Fix mobile rotation
    image = ImageOps.exif_transpose(image)

    # Create square thumbnail with padding (VERY IMPORTANT)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)

    image_array = np.asarray(image).astype(np.float32)

    # Teachable machine normalization
    normalized = (image_array / 127.5) - 1

    data = np.expand_dims(normalized, axis=0)
    return data

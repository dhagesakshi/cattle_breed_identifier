import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet import preprocess_input
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout, BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras import callbacks
import numpy as np
from collections import Counter
import json
import os

# =========================
# CONFIG
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "dataset"))
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

print("📂 Dataset directory:", DATASET_DIR)

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 30
FINE_TUNE_EPOCHS = 10
LEARNING_RATE = 1e-4

# =========================
# DATA GENERATORS
# =========================
train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=25,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    shear_range=0.15,
    brightness_range=(0.8, 1.2),
    validation_split=0.2
)

val_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    validation_split=0.2
)

train_data = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training",
    shuffle=True
)

val_data = val_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
    shuffle=False
)

NUM_CLASSES = train_data.num_classes
print("✅ Number of classes:", NUM_CLASSES)

# =========================
# RESNET BASE MODEL
# =========================
base_model = ResNet50(
    weights="imagenet",
    include_top=False,
    input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
)

# Freeze the base model initially
for layer in base_model.layers[-120:]:
    layer.trainable = False

# =========================
# CLASSIFIER HEAD
# =========================
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.6)(x)
outputs = Dense(NUM_CLASSES, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=outputs)

# =========================
# COMPILE
# =========================
model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# =========================
# TRAIN
# =========================
print("🚀 Starting training...")

# compute class weights to help with class imbalance
counter = Counter(train_data.classes)
max_count = float(max(counter.values()))
class_weights = {cls: max_count / num for cls, num in counter.items()}

# callbacks: early stopping, reduce LR on plateau, checkpoint
checkpoint_cb = callbacks.ModelCheckpoint(
    filepath=os.path.join(MODEL_DIR, "breed_model.h5"),
    monitor="val_loss",
    save_best_only=True,
    verbose=1
)
earlystop_cb = callbacks.EarlyStopping(monitor="val_loss", patience=6, restore_best_weights=True, verbose=1)
reduce_lr_cb = callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, verbose=1)

steps_per_epoch = max(1, train_data.samples // BATCH_SIZE)
validation_steps = max(1, val_data.samples // BATCH_SIZE)

from sklearn.utils.class_weight import compute_class_weight
import numpy as np

class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_data.classes),
    y=train_data.classes
)

class_weights = dict(enumerate(class_weights))
print("Class weights:", class_weights)

history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS,
    steps_per_epoch=steps_per_epoch,
    validation_steps=validation_steps,
    class_weight=class_weights,
    callbacks=[checkpoint_cb, earlystop_cb, reduce_lr_cb]
)

# =========================
# FINE-TUNING
# =========================
print("🔁 Fine-tuning ResNet...")

# Unfreeze a portion of the backbone for fine-tuning
fine_tune_at = -60 if len(base_model.layers) > 60 else -30
for layer in base_model.layers[fine_tune_at:]:
    layer.trainable = True

model.compile(
    optimizer=Adam(learning_rate=5e-6),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

history_ft = model.fit(
    train_data,
    validation_data=val_data,
    epochs=FINE_TUNE_EPOCHS,
    steps_per_epoch=steps_per_epoch,
    validation_steps=validation_steps,
    class_weight=class_weights,
    callbacks=[checkpoint_cb, earlystop_cb, reduce_lr_cb]
)

# =========================
# SAVE MODEL
# =========================
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
# model was saved by the checkpoint callback; ensure labels are saved too
labels = {str(v): k for k, v in train_data.class_indices.items()}
with open(os.path.join(MODEL_DIR, "labels.json"), "w") as f:
    json.dump(labels, f)

print("✅ Model trained and saved successfully")

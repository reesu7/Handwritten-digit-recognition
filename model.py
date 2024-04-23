#importing all libraries 
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
import shutil

from tensorflow.keras.utils import to_categorical
from tensorflow.keras.datasets import mnist 
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Conv2D, MaxPooling2D, Flatten, BatchNormalization

#loading dataset
(x_train, y_train), (x_test, y_test) = mnist.load_data()

#checking dataset
print(x_train.shape)

#parameter
tot_class = 10
epoch = 30
rows = 28
col = 28
batch_size = 64  # Define batch size

#visualizing dataset
plt.imshow(x_train[0])
plt.show()

#normalizing dataset
x_train = x_train.astype(float) / 255
x_test = x_test.astype(float) / 255

if tf.keras.backend.image_data_format() == 'channels_first':
    x_train = x_train.reshape(x_train.shape[0], 1, rows, col)
    x_test = x_test.reshape(x_test.shape[0], 1, rows, col)
    input_shape = (1, rows, col)
else:
    x_train = x_train.reshape(x_train.shape[0], rows, col, 1)
    x_test = x_test.reshape(x_test.shape[0], rows, col, 1)
    input_shape = (rows, col, 1)

#model building 
model = Sequential()
model.add(Conv2D(32, kernel_size=3, activation='relu', input_shape=input_shape))
model.add(MaxPooling2D())
model.add(Conv2D(32, kernel_size=3, activation='relu'))
model.add(BatchNormalization())
model.add(Conv2D(32, kernel_size=5, strides=2, padding='same', activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.4))
model.add(Conv2D(64, kernel_size=3, activation='relu'))
model.add(BatchNormalization())
model.add(Conv2D(64, kernel_size=3, activation='relu'))
model.add(BatchNormalization())
model.add(Conv2D(64, kernel_size=5, strides=2, padding='same', activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.4))
model.add(Flatten())
model.add(Dropout(0.4))
model.add(Dense(10, activation='softmax'))

#model compilation
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

model.summary()
model.fit(x_train, to_categorical(y_train, num_classes=10), batch_size=batch_size, epochs=epoch, validation_data=(x_test, to_categorical(y_test, num_classes=10)))

score, accuracy = model.evaluate(x_test, to_categorical(y_test, num_classes=10))
print("Score is:", score)
print("Accuracy:", accuracy)

# Save the model in HDF5 format
model.save("model/model.h5")

print("Model saved in HDF5 format as 'model.h5'.")

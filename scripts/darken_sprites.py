from PIL import Image, ImageEnhance
import os


# Function to darken an image
def darken_image(image_path, output_path, factor=0.15):
    image = Image.open(image_path)

    # Convert image to 'RGBA' to ensure compatibility
    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    enhancer = ImageEnhance.Brightness(image)
    darkened_image = enhancer.enhance(factor)
    darkened_image.save(output_path)


# Function to process all images in the directory
def darken_all_sprites(input_dir='pokemon', output_dir='pokemon-dark'):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Iterate through all files in the input directory
    for filename in os.listdir(input_dir):
        if filename.endswith('.png'):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            darken_image(input_path, output_path)

    print("All images have been darkened and saved to the output directory.")

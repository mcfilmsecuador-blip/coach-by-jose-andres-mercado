"""
Generate a single exercise image, compress to WebP, and print result.
Usage: python3 gen_image.py <exercise_id> "<prompt>"
"""
import sys, os
from google import genai
from google.genai import types
from PIL import Image

exercise_id = sys.argv[1]
prompt = sys.argv[2]

OUT_DIR = '/Users/andresmercado/Documents/App GYM/App Coach/public/exercises'
png_path = os.path.join(OUT_DIR, f'{exercise_id}.png')
webp_path = os.path.join(OUT_DIR, f'{exercise_id}.webp')

client = genai.Client()

try:
    response = client.models.generate_images(
        model='imagen-3.0-generate-002',
        prompt=prompt,
        config=types.GenerateImagesConfig(number_of_images=1, output_mime_type='image/png')
    )
    img_data = response.generated_images[0].image
    with open(png_path, 'wb') as f:
        f.write(img_data.image_bytes)
    
    # Compress to WebP
    img = Image.open(png_path)
    img = img.resize((450, 450), Image.LANCZOS)
    img.save(webp_path, 'WEBP', quality=70, method=6)
    os.remove(png_path)
    
    print(f'OK:{exercise_id}:{os.path.getsize(webp_path)}')
except Exception as e:
    error_str = str(e)
    if '429' in error_str or 'quota' in error_str.lower() or 'rate' in error_str.lower():
        print(f'QUOTA_ERROR:{exercise_id}:{error_str}')
    else:
        print(f'ERROR:{exercise_id}:{error_str}')

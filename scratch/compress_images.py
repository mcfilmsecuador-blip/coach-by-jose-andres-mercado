import os
import sys
import glob
from PIL import Image

src_dir = "/Users/andresmercado/Documents/App GYM/App Coach/scratch/generated"
dist_dir = "/Users/andresmercado/Documents/App GYM/App Coach/public/exercises"

os.makedirs(dist_dir, exist_ok=True)
os.makedirs(src_dir, exist_ok=True)

print("Starting WebP compression script...")
png_files = glob.glob(os.path.join(src_dir, "*.png"))
print(f"Found {len(png_files)} PNG files to compress.")

for file_path in png_files:
    filename = os.path.basename(file_path)
    name_without_ext = os.path.splitext(filename)[0]
    dest_path = os.path.join(dist_dir, name_without_ext + ".webp")
    
    try:
        img = Image.open(file_path)
        img.thumbnail((450, 450)) # Downscale
        img.save(dest_path, "WEBP", quality=75)
        orig_size = os.path.getsize(file_path) // 1024
        new_size = os.path.getsize(dest_path) // 1024
        print(f"Compressed {filename} ({orig_size}KB) -> {name_without_ext}.webp ({new_size}KB)")
    except Exception as e:
        print(f"Error compressing {filename}: {e}")

print("Compression complete.")

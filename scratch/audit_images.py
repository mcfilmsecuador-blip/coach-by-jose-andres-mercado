"""
Audit script: Compare every exercise ID in exercisesData.js against
the actual .webp files in public/exercises/.
Output: which exercises have their own unique image vs. which are using
a shared/fallback image.
"""
import os
import re

# 1. Parse all exercise IDs from exercisesData.js
data_file = "/Users/andresmercado/Documents/App GYM/App Coach/src/data/exercisesData.js"
with open(data_file, "r") as f:
    content = f.read()

# Extract all IDs from the rawGroups arrays (5th element in each array)
ids = re.findall(r'"([a-z_]+)"(?:\])', content)
# Also get IDs from the array pattern [... "id"]
ids2 = re.findall(r',\s*"([a-z][a-z0-9_]+)"\s*\]', content)
all_ids = sorted(set(ids + ids2))

# 2. List all .webp files in public/exercises/
webp_dir = "/Users/andresmercado/Documents/App GYM/App Coach/public/exercises"
webp_files = set()
for f in os.listdir(webp_dir):
    if f.endswith(".webp"):
        webp_files.add(f.replace(".webp", ""))

# 3. Check the specificExercises list in getExerciseImage
specific_match = re.search(r'const specificExercises = \[(.*?)\];', content, re.DOTALL)
specific_ids = set()
if specific_match:
    specific_ids = set(re.findall(r'"([a-z_]+)"', specific_match.group(1)))

# 4. Report
print(f"Total exercise IDs found: {len(all_ids)}")
print(f"Total .webp files found: {len(webp_files)}")
print(f"Exercise IDs in specificExercises list: {len(specific_ids)}")
print()

has_own = []
uses_fallback = []
missing_webp = []

for eid in all_ids:
    if eid in webp_files and eid in specific_ids:
        has_own.append(eid)
    elif eid in webp_files:
        # Has a webp but not in specific list — still uses fallback logic
        uses_fallback.append(eid)
    else:
        missing_webp.append(eid)

print(f"=== EXERCISES WITH OWN UNIQUE IMAGE ({len(has_own)}) ===")
for e in has_own:
    print(f"  ✅ {e}")

print(f"\n=== EXERCISES USING SHARED FALLBACK ({len(uses_fallback)}) ===")
for e in uses_fallback:
    print(f"  ⚠️  {e}")

print(f"\n=== EXERCISES WITH NO WEBP AT ALL ({len(missing_webp)}) ===")
for e in missing_webp:
    print(f"  ❌ {e}")

# 5. Summary of what needs to be generated
needs_image = sorted(set(uses_fallback + missing_webp))
print(f"\n{'='*60}")
print(f"TOTAL EXERCISES NEEDING UNIQUE IMAGES: {len(needs_image)}")
print(f"{'='*60}")
for i, e in enumerate(needs_image, 1):
    print(f"  {i:3d}. {e}")

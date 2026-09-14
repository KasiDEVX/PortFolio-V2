import os
from PIL import Image

image_configs = {
    'cloud_left_cinematic.webp': {'max_w': 1024, 'q': 75, 'aq': 70},
    'cloud_right_cinematic.webp': {'max_w': 1024, 'q': 75, 'aq': 70},
    'AOT_clean.webp': {'max_w': 1000, 'q': 75},
    'about.webp': {'max_w': 700, 'q': 75},
    'work_1_md.webp': {'max_w': 1000, 'q': 75},
    'work_2_md.webp': {'max_w': 1000, 'q': 75},
    'work_3_md.webp': {'max_w': 1000, 'q': 75},
    'work_4_full.webp': {'max_w': 1000, 'q': 75},
    'work_5_placeholder.webp': {'max_w': 1000, 'q': 75},
    'work_6_placeholder.webp': {'max_w': 1000, 'q': 75},
}

total_before = 0
total_after = 0
updated_dims = {}

for name, conf in image_configs.items():
    p = os.path.join('images', name)
    if not os.path.exists(p):
        print(f"Skipping {name} (not found)")
        continue
    
    orig_sz = os.path.getsize(p)
    im = Image.open(p)
    w, h = im.size
    
    if w > conf['max_w']:
        new_h = int(h * (conf['max_w'] / w))
        im = im.resize((conf['max_w'], new_h), Image.Resampling.LANCZOS)
    
    save_kwargs = {
        'format': 'WEBP',
        'quality': conf.get('q', 75),
        'method': 6
    }
    if 'aq' in conf and im.mode == 'RGBA':
        save_kwargs['alpha_quality'] = conf['aq']
        
    im.save(p, **save_kwargs)
    new_sz = os.path.getsize(p)
    
    total_before += orig_sz
    total_after += new_sz
    updated_dims[name] = im.size
    saved_pct = 100 - (new_sz / orig_sz * 100)
    print(f"[OK] {name:28}: {orig_sz/1024:5.1f}KB -> {new_sz/1024:5.1f}KB (-{saved_pct:4.1f}%) new dim={im.size}")

saved_kb = (total_before - total_after) / 1024
print(f"\nTotal image payload: {total_before/1024:.1f} KB -> {total_after/1024:.1f} KB (Saved {saved_kb:.1f} KB / {(total_before-total_after)/total_before*100:.1f}%)")
print("\nUpdated dimensions map:")
for k, v in updated_dims.items():
    print(f"  '{k}': width='{v[0]}' height='{v[1]}'")

import os

base_dir = r"C:\Users\vishn\.gemini\antigravity-ide\brain\a8afcf70-9af9-4710-9e61-96a852765a37"
target = "==Start of OCR for page 1=="

for root, dirs, files in os.walk(base_dir):
    for file in files:
        p = os.path.join(root, file)
        try:
            with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                c = f.read()
                if target in c:
                    print(f"FOUND target in {p} (file size {len(c)})")
        except Exception as e:
            pass

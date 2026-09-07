import os
import time

app_data = r"C:\Users\vishn\.gemini\antigravity-ide"
now = time.time()

for root, dirs, files in os.walk(app_data):
    for f in files:
        p = os.path.join(root, f)
        try:
            mtime = os.path.getmtime(p)
            if now - mtime < 3600: # last 1 hour
                if f.endswith('.txt') or f.endswith('.json') or f.endswith('.log'):
                    size = os.path.getsize(p)
                    if size > 5000:
                        print(f"{p} ({size} bytes)")
        except Exception:
            pass

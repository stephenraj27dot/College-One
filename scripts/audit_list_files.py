import os

for root_dir in ['src', 'public', 'scripts']:
    print(f"\n=================== Directory: {root_dir} ===================")
    for root, dirs, files in os.walk(root_dir):
        for f in files:
            p = os.path.join(root, f)
            size = os.path.getsize(p)
            print(f"{p} ({size} bytes)")

import os
import re

src_files = []
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.ts', '.tsx', '.js', '.jsx')):
            src_files.append(os.path.join(root, f))

print(f"Total source files in src: {len(src_files)}")

# Check dependencies
deps = ['cheerio', 'pdf-parse', 'pdf2json', 'dotenv', 'zod', '@supabase/ssr', '@supabase/supabase-js', 'clsx', 'tailwind-merge', 'lucide-react']
dep_usage = {d: [] for d in deps}

for p in src_files:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()
        for d in deps:
            if f"from '{d}'" in txt or f'from "{d}"' in txt or f"require('{d}')" in txt or f'require("{d}")' in txt:
                dep_usage[d].append(p)

print("\n--- Dependency Usage in src/ ---")
for d, used_in in dep_usage.items():
    print(f"[{d}]: used in {len(used_in)} files -> {used_in}")

# Check data files
data_files = ['allColleges.json', 'tn38DistrictsColleges', 'tneaMasterCodes', 'verifiedTamilNaduData', 'collegeImages']
data_usage = {df: [] for df in data_files}

for p in src_files:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        txt = f.read()
        for df in data_files:
            if df in txt:
                data_usage[df].append(p)

print("\n--- Data File Usage in src/ ---")
for df, used_in in data_usage.items():
    print(f"[{df}]: referenced in {len(used_in)} files -> {used_in}")

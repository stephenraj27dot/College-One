import os

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.ts', '.tsx', '.js', '.jsx')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
                if "from('colleges')" in txt or 'from("colleges")' in txt or "college_courses" in txt or "from('courses')" in txt:
                    print('DB query in:', p)

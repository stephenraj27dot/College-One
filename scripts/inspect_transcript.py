import json

transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\a8afcf70-9af9-4710-9e61-96a852765a37\.system_generated\logs\transcript_full.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        try:
            item = json.loads(line)
            content = item.get('content', '')
            if isinstance(content, str) and len(content) > 1000:
                print(f"Line {idx}: type={item.get('type')}, source={item.get('source')}, len={len(content)}")
                if "MASTER COLLEGE DIRECTORY" in content:
                    print(f"  --> Found MASTER COLLEGE DIRECTORY in Line {idx}!")
                if "COLLEGE NAME & COURSES DIRECTORY" in content:
                    print(f"  --> Found COLLEGE NAME & COURSES DIRECTORY in Line {idx}!")
        except Exception as e:
            pass

import json

transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\a8afcf70-9af9-4710-9e61-96a852765a37\.system_generated\logs\transcript_full.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    print(f"Total lines in transcript_full: {len(lines)}")
    for i in range(120, min(135, len(lines))):
        data = json.loads(lines[i])
        print(f"Line {i}: type={data.get('type')}, source={data.get('source')}, content_len={len(str(data.get('content', '')))}")

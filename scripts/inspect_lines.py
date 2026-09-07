import json

transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\a8afcf70-9af9-4710-9e61-96a852765a37\.system_generated\logs\transcript_full.jsonl"
with open(transcript_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if idx >= 158:
            item = json.loads(line)
            print(f"Line {idx}: type={item.get('type')}, source={item.get('source')}, len={len(line)}")
            content = str(item.get('content', ''))
            print("  content start:", repr(content[:100]))
            if 'tool_calls' in item:
                print("  tool_calls:", len(item['tool_calls']))

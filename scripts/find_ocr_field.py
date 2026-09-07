import json

transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\a8afcf70-9af9-4710-9e61-96a852765a37\.system_generated\logs\transcript_full.jsonl"
target = "==Start of OCR for page 1=="

with open(transcript_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if target in line:
            print(f"Line {idx} contains target!")
            item = json.loads(line)
            print("  Keys:", list(item.keys()))
            print("  Type:", item.get("type"))
            print("  Source:", item.get("source"))
            for k, v in item.items():
                if isinstance(v, str) and target in v:
                    print(f"  Target is in field '{k}', len={len(v)}")
                elif isinstance(v, list):
                    for elem in v:
                        if target in str(elem):
                            print(f"  Target is in list field '{k}'")

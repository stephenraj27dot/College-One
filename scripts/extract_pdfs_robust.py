import json

transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\97bc51ee-02d3-486d-93dd-a37d5aa0bdcb\.system_generated\logs\transcript_full.jsonl"

pdf1_text = ""
pdf2_text = ""

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT' and '==Start of PDF==' in data.get('content', ''):
                content = data['content']
                parts = content.split('==Start of PDF==')
                if len(parts) >= 3:
                    # PDF 1 is parts[1], PDF 2 is parts[2]
                    pdf1_text = parts[1].split('==End of PDF==')[0].strip()
                    pdf2_text = parts[2].split('==End of PDF==')[0].strip()
        except Exception:
            pass

if pdf1_text and pdf2_text:
    with open('scripts/pdf1_clean.txt', 'w', encoding='utf-8') as f:
        f.write(pdf1_text)
    with open('scripts/pdf2_clean.txt', 'w', encoding='utf-8') as f:
        f.write(pdf2_text)
    print("Successfully extracted both PDFs")
else:
    print("Failed to extract PDFs")

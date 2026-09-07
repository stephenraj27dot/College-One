import json
import os

# Path to the transcript
transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\97bc51ee-02d3-486d-93dd-a37d5aa0bdcb\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT' and '==Start of PDF==' in data.get('content', ''):
            content = data['content']
            # split by "==End of PDF=="
            parts = content.split("==End of PDF==")
            if len(parts) >= 2:
                pdf_1_text = parts[0]
                pdf_2_text = parts[1]
                
                with open("scripts/pdf1_text.txt", "w", encoding="utf-8") as out1:
                    out1.write(pdf_1_text)
                    
                with open("scripts/pdf2_text.txt", "w", encoding="utf-8") as out2:
                    out2.write(pdf_2_text)
                print("Extracted PDF texts")
            break

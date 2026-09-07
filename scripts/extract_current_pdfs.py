import os

transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\a8afcf70-9af9-4710-9e61-96a852765a37\.system_generated\logs\transcript_full.jsonl"

pdf_num = 0

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if "==Start of PDF==" in line:
            parts = line.split("==Start of PDF==")
            for part in parts[1:]:
                end_split = part.split("==End of PDF==")
                if len(end_split) > 0:
                    text = end_split[0].replace('\\n', '\n').replace('\\r', '\r')
                    pdf_num += 1
                    with open(f"scripts/current_pdf_{pdf_num}.txt", "w", encoding="utf-8") as out:
                        out.write(text)
                    print(f"Wrote scripts/current_pdf_{pdf_num}.txt (len={len(text)})")

print(f"Total extracted: {pdf_num} PDFs")

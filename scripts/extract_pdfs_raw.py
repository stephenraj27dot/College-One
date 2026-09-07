import os

transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\97bc51ee-02d3-486d-93dd-a37d5aa0bdcb\.system_generated\logs\transcript_full.jsonl"

found_pdf_1 = False
found_pdf_2 = False

out1 = open("scripts/pdf1_raw.txt", "w", encoding="utf-8")
out2 = open("scripts/pdf2_raw.txt", "w", encoding="utf-8")

pdf_num = 0

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if "==Start of PDF==" in line:
            parts = line.split("==Start of PDF==")
            for part in parts[1:]:
                # find end
                end_split = part.split("==End of PDF==")
                if len(end_split) > 0:
                    text = end_split[0]
                    pdf_num += 1
                    if pdf_num == 1:
                        out1.write(text)
                    elif pdf_num == 2:
                        out2.write(text)

out1.close()
out2.close()
print(f"Extracted {pdf_num} PDFs")

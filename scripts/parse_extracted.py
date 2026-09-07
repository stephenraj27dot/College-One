import json
import re

transcript_path = r"C:\Users\vishn\.gemini\antigravity-ide\brain\97bc51ee-02d3-486d-93dd-a37d5aa0bdcb\.system_generated\logs\transcript_full.jsonl"

pdf_texts = []

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if "==Start of PDF==" in line:
            parts = line.split("==Start of PDF==")
            for part in parts[1:]:
                end_split = part.split("==End of PDF==")
                if len(end_split) > 0:
                    text = end_split[0].replace('\\n', '\n').replace('\\r', '\r')
                    pdf_texts.append(text)

print(f"Total PDF blocks found: {len(pdf_texts)}")

if len(pdf_texts) >= 2:
    pdf1 = pdf_texts[-2] # Second to last (Master Directory)
    pdf2 = pdf_texts[-1] # Last (Courses)
else:
    print("Not enough PDFs found!")
    exit(1)

colleges = []
courses_map = {} # code -> list of courses

# Parse PDF 1 (Colleges)
# Lines look like: Name Address Code District City Institution Type
# But it's somewhat tabulated or multiline.
# Let's extract using a regex for the rows. We know Code is a number.

for line in pdf1.split('\n'):
    line = line.strip()
    # A simple heuristic: if there's a standalone number that looks like a code (e.g. 1 to 5999)
    # Actually OCR usually produces somewhat messy lines. 
    pass

# Wait, let's just write the two PDFs to disk properly unescaped first, so I can inspect them.
with open("scripts/pdf1_clean.txt", "w", encoding="utf-8") as f:
    f.write(pdf1)
with open("scripts/pdf2_clean.txt", "w", encoding="utf-8") as f:
    f.write(pdf2)
print("Saved clean pdfs.")

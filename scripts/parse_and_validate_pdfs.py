import pdfplumber
import re
import json

pdf1_path = r"C:\Users\vishn\Downloads\TNEA_2025_Master_College_Directory 1.pdf"
pdf2_path = r"C:\Users\vishn\Downloads\TNEA_2025_College_Name_Courses.pdf"

# ==========================================
# 1. PARSE PDF #1: Colleges Directory
# ==========================================
print("=== PARSING PDF #1: Master College Directory ===")
colleges = []
seen_codes = set()

with pdfplumber.open(pdf1_path) as pdf:
    for page_idx, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        if not tables:
            print(f"WARNING: No table on page {page_idx + 1}")
            continue
        for row in tables[0]:
            if not row or len(row) < 6:
                continue
            # Header check
            if row[2] == 'Code' or 'College Name' in (row[0] or ''):
                continue
            
            college_name = (row[0] or '').strip().replace('\n', ' ')
            address = (row[1] or '').strip().replace('\n', ' ')
            code_str = (row[2] or '').strip().replace('\n', '')
            district = (row[3] or '').strip().replace('\n', '')
            city = (row[4] or '').strip().replace('\n', '')
            inst_type = (row[5] or '').strip().replace('\n', ' ')
            
            # Clean up hyphenation or line-broken words in district / city if any
            district = re.sub(r'\s+', '', district)
            city = re.sub(r'\s+', '', city)
            
            if not code_str or not code_str.isdigit():
                continue
            
            tnea_code = int(code_str)
            
            # Source note: for ~40 colleges whose source had no comma in address,
            # we keep raw_address_source
            raw_address_source = None
            if not address or ',' not in address:
                raw_address_source = f"{college_name} {address}".strip()

            colleges.append({
                "tnea_code": tnea_code,
                "college_name": college_name,
                "address": address,
                "raw_address_source": raw_address_source,
                "district": district,
                "city": city,
                "institution_type_inferred": inst_type,
                "source": "TNEA 2025 Master College Directory"
            })
            seen_codes.add(tnea_code)

print(f"Extracted {len(colleges)} colleges from PDF #1. Unique TNEA codes: {len(seen_codes)}")

# ==========================================
# 2. PARSE PDF #2: Courses Directory
# ==========================================
print("\n=== PARSING PDF #2: College Name & Courses Directory ===")

# Concatenate all pages text, replacing (cid:127) with •
all_pdf2_text = ""
with pdfplumber.open(pdf2_path) as pdf:
    for page_idx, page in enumerate(pdf.pages):
        text = page.extract_text()
        if text:
            # Normalize bullet points
            text = text.replace('(cid:127)', '•')
            # Remove header line: "TNEA 2025 ... Page X"
            lines = text.split('\n')
            filtered_lines = []
            for l in lines:
                if re.search(r'TNEA 2025.*?Directory', l, re.IGNORECASE):
                    continue
                if re.search(r'Total Colleges:\s*428', l, re.IGNORECASE):
                    continue
                filtered_lines.append(l)
            all_pdf2_text += "\n" + "\n".join(filtered_lines)

# Split by college blocks: [<tnea_code>] <College Name>
# Pattern matches: [1234] Some College Name
blocks = re.split(r'\n(?=\[\d+\]\s+)', all_pdf2_text.strip())

college_courses_map = {} # tnea_code -> list of course_name_raw

for block in blocks:
    block = block.strip()
    if not block:
        continue
    # Extract header: [<code_str>] <college_name>
    header_match = re.match(r'^\[(\d+)\]\s*([^\n\•]+)(.*)', block, re.DOTALL)
    if not header_match:
        # Check if block starts with [code]
        print(f"WARNING: Could not parse header for block:\n{block[:100]}")
        continue
    
    code_str = header_match.group(1)
    tnea_code = int(code_str)
    header_name = header_match.group(2).strip()
    rest = header_match.group(3).strip()
    
    # Courses are in 'rest', separated by •
    # Sometimes the first course might follow immediately after header or on new lines
    # Split on • strictly
    raw_parts = rest.split('•')
    courses_list = []
    for part in raw_parts:
        # Clean newlines and whitespace within a course name (e.g. line wrapped course names)
        course_name = re.sub(r'\s+', ' ', part).strip()
        if course_name:
            courses_list.append(course_name)
            
    college_courses_map[tnea_code] = {
        "header_name": header_name,
        "courses": courses_list
    }

print(f"Extracted courses for {len(college_courses_map)} colleges from PDF #2.")

# ==========================================
# 3. VALIDATIONS
# ==========================================
print("\n=== RUNNING VALIDATIONS ===")

# 1. Total count == 428
print(f"1. Colleges count == 428: {len(colleges) == 428} ({len(colleges)})")
print(f"   Courses colleges count == 428: {len(college_courses_map) == 428} ({len(college_courses_map)})")

# 2. Symmetric codes
pdf1_codes = set(c['tnea_code'] for c in colleges)
pdf2_codes = set(college_courses_map.keys())

diff_1_not_2 = pdf1_codes - pdf2_codes
diff_2_not_1 = pdf2_codes - pdf1_codes

print(f"2. Symmetric TNEA codes check:")
print(f"   In PDF 1 but not PDF 2: {diff_1_not_2}")
print(f"   In PDF 2 but not PDF 1: {diff_2_not_1}")

# 3. Non-empty courses
empty_courses = [code for code, data in college_courses_map.items() if len(data['courses']) == 0]
print(f"3. Colleges with 0 courses: {empty_courses}")

# 4. Spot check
print("\n4. Spot checks:")
if 1211 in college_courses_map:
    c1211 = college_courses_map[1211]['courses']
    print(f"   Code 1211 (Rajalakshmi Engineering College): {len(c1211)} courses (Expected: 19) -> {'PASS' if len(c1211) == 19 else 'FAIL'}")
    if len(c1211) != 19:
        print("   Actual 1211 courses:", c1211)

if 2711 in college_courses_map:
    c2711 = college_courses_map[2711]['courses']
    print(f"   Code 2711 (Kongu Engineering College): {len(c2711)} courses (Expected: 14) -> {'PASS' if len(c2711) == 14 else 'FAIL'}")
    if len(c2711) != 14:
        print("   Actual 2711 courses:", c2711)

# Total courses count across all colleges
total_courses_count = sum(len(d['courses']) for d in college_courses_map.values())
print(f"\nTotal course offerings across all 428 colleges: {total_courses_count}")

# Save clean extracted data to json
with open("scripts/tnea_428_colleges.json", "w", encoding="utf-8") as f:
    json.dump(colleges, f, indent=2, ensure_ascii=False)

with open("scripts/tnea_428_courses.json", "w", encoding="utf-8") as f:
    json.dump(college_courses_map, f, indent=2, ensure_ascii=False)

print("\nSaved scripts/tnea_428_colleges.json and scripts/tnea_428_courses.json successfully!")

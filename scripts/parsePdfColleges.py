import re
import json

def parse_colleges():
    colleges = []
    current_district = None

    with open('scripts/pdf_ocr_data.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Regex for district header
    # e.g., "Chengalpattu District — 13 college(s)"
    district_re = re.compile(r'^(.*?) District — \d+ college\(s\)')

    # Regex for college row
    # e.g., "College Name 1234 City Name District Name Institution Type"
    
    inst_types = [
        'Self-Financing / Private',
        'Autonomous',
        'Constituent',
        'Government-Aided',
        'Government'
    ]
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        district_match = district_re.match(line)
        if district_match:
            current_district = district_match.group(1).strip()
            continue
            
        if current_district:
            # Let's try to extract the 4 digit code
            code_match = re.search(r'\s(\d{4})\s', line)
            if code_match:
                code = code_match.group(1)
                parts = line.split(code)
                name = parts[0].strip()
                rest = parts[1].strip()
                
                # Find institution type
                inst_type = None
                for it in inst_types:
                    if rest.endswith(it):
                        inst_type = it
                        rest = rest[:-len(it)].strip()
                        break
                        
                if inst_type:
                    # 'rest' is now "City District"
                    # Remove the district from the end if it matches
                    district = current_district
                    city = rest
                    if city.endswith(district):
                        city = city[:-len(district)].strip()
                    
                    # Generate a slug
                    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
                    
                    colleges.append({
                        "slug": slug,
                        "name": name,
                        "tnea_code": code,
                        "district": district,
                        "city": city,
                        "institution_type": inst_type
                    })
                else:
                    print(f"Could not parse inst_type for: {line}")
            else:
                print(f"Could not find 4-digit code in: {line}")
                
    with open('scripts/pdf_colleges.json', 'w', encoding='utf-8') as f:
        json.dump(colleges, f, indent=2)
        
    print(f"Parsed {len(colleges)} colleges.")

if __name__ == '__main__':
    parse_colleges()

import json
import re

colleges_dict = {}

with open('scripts/pdf_courses_extracted.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# We can split by "[Code:"
parts = text.split("[Code:")
# parts[0] is everything before the first "[Code:"
# parts[1] starts with " 1423]\nElectronics & Communication..."
# wait, if the text belonging to a college is ABOVE it, then parts[0] belongs to the FIRST code?
# Yes! The courses for college 1 are in parts[0]. But wait, parts[0] is at the TOP of the file.
# The file is ordered. If the courses are ABOVE the college name, then parts[0] contains the courses for the FIRST college, whose name and code are at the END of parts[0]? NO. The code is at the start of parts[1].

# Let's just do a regex find all:
matches = list(re.finditer(r'\[Code:\s*(\d+)\]', text))

for i, match in enumerate(matches):
    code = match.group(1)
    
    # The text for this code is everything BEFORE this match, up to the PREVIOUS match
    start_pos = 0 if i == 0 else matches[i-1].end()
    end_pos = match.start()
    
    block = text[start_pos:end_pos]
    
    # Extract courses from the block
    courses = []
    # Lines with "Courses:" or just comma separated words
    lines = block.split('\n')
    for line in lines:
        line = line.strip()
        if "Courses:" in line:
            courses_str = line.split("Courses:")[1]
            for c in courses_str.split(','):
                c = c.strip()
                if c and not 'Private' in c and not 'Constituent' in c:
                    courses.append(c)
        elif line and ',' in line and not 'Private' in line and not 'Constituent' in line and not 'District' in line:
            # might be continuation of courses
            for c in line.split(','):
                c = c.strip()
                if c:
                    courses.append(c)
                    
    colleges_dict[code] = {"courses": courses}

with open('scripts/parsed_courses.json', 'w', encoding='utf-8') as f:
    json.dump(colleges_dict, f, indent=2)

print("Parsed courses successfully!")

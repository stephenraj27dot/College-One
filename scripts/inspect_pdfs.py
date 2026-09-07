import pdfplumber

pdf1_path = r"C:\Users\vishn\Downloads\TNEA_2025_Master_College_Directory 1.pdf"
pdf2_path = r"C:\Users\vishn\Downloads\TNEA_2025_College_Name_Courses.pdf"

print("--- Inspecting PDF #1 ---")
with pdfplumber.open(pdf1_path) as pdf:
    print(f"Total pages in PDF 1: {len(pdf.pages)}")
    p1 = pdf.pages[0]
    tables = p1.extract_tables()
    print(f"Tables on page 1: {len(tables)}")
    if tables:
        print("Header / First row:", tables[0][0])
        print("Second row:", tables[0][1] if len(tables[0]) > 1 else "None")
        print("Rows on page 1:", len(tables[0]))

print("\n--- Inspecting PDF #2 ---")
with pdfplumber.open(pdf2_path) as pdf:
    print(f"Total pages in PDF 2: {len(pdf.pages)}")
    p1 = pdf.pages[0]
    text = p1.extract_text()
    print("Page 1 text excerpt:\n", text[:500])

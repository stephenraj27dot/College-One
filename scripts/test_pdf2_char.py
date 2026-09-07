import pdfplumber

pdf2_path = r"C:\Users\vishn\Downloads\TNEA_2025_College_Name_Courses.pdf"
with pdfplumber.open(pdf2_path) as pdf:
    p1 = pdf.pages[0]
    raw = p1.extract_text()
    print("Raw page 1 text:")
    print(repr(raw[:400]))

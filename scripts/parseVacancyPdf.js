const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync("scripts/vacancy_matrix_extracted.txt", pdfParser.getRawTextContent());
    console.log("Extraction complete!");
});

pdfParser.loadPDF("C:/Users/vishn/.gemini/antigravity-ide/brain/9e921495-46cf-476f-b0d7-9d7dc1123ed5/.user_uploaded/media_1788677726439.pdf");

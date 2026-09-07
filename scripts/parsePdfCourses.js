const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:/Users/vishn/.gemini/antigravity-ide/brain/9e921495-46cf-476f-b0d7-9d7dc1123ed5/.user_uploaded/media_1788673712475.pdf');

pdf(dataBuffer).then(function(data) {
  fs.writeFileSync('scripts/pdf_courses_extracted.txt', data.text);
  console.log('Successfully extracted ' + data.text.length + ' characters.');
}).catch(function(error) {
  console.error("Error parsing PDF: " + error.message);
});

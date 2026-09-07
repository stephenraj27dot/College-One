const fs = require('fs');

function extract() {
  const content = fs.readFileSync('C:/Users/vishn/.gemini/antigravity-ide/brain/9e921495-46cf-476f-b0d7-9d7dc1123ed5/.system_generated/logs/transcript_full.jsonl', 'utf8');
  let extractedText = '';
  
  // Try to find the block containing the OCR text from the user input
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.includes('==Start of OCR for page 1==')) {
      // Find the JSON object
      try {
        const obj = JSON.parse(line);
        let text = obj.content;
        
        // Extract just the OCR blocks
        const ocrMatches = text.match(/==Start of OCR for page \d+==\n([\s\S]*?)\n==End of OCR for page \d+==/g);
        if (ocrMatches) {
          extractedText = ocrMatches.map(m => m.replace(/==Start of OCR for page \d+==\n/, '').replace(/\n==End of OCR for page \d+==/, '')).join('\n');
        }
      } catch (e) {
         console.error('Error parsing line', e.message);
      }
    }
  }
  
  if (extractedText) {
    fs.writeFileSync('scripts/pdf_courses_extracted.txt', extractedText);
    console.log('Successfully extracted ' + extractedText.length + ' characters.');
  } else {
    console.log('Failed to find OCR text.');
  }
}

extract();

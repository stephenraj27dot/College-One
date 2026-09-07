const fs = require('fs');
const lines = fs.readFileSync('scripts/pdf_ocr_data.txt', 'utf8').split('\n');
const codeMap = {};
const duplicates = {};

lines.forEach(line => {
    line = line.trim();
    if (!line || line.includes('college(s)')) return;
    
    // The code is usually a 4-digit number. We'll extract all numbers that are standalone and 1-4 digits.
    // E.g., "Ariyalur Engineering College 3462 Karuppur-Senapathy Post..."
    const match = line.match(/\b([1-9]\d{0,3})\b/);
    if (match) {
        const code = match[1];
        if (codeMap[code]) {
            if (!duplicates[code]) {
                duplicates[code] = [codeMap[code]];
            }
            duplicates[code].push(line);
        } else {
            codeMap[code] = line;
        }
    }
});

if (Object.keys(duplicates).length > 0) {
    console.log('Duplicates found:');
    for (const [code, colleges] of Object.entries(duplicates)) {
        console.log(`\nCode ${code}:`);
        colleges.forEach(c => console.log('  ' + c));
    }
} else {
    console.log('No duplicates found.');
}

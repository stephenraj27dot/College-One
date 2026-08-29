const fs = require('fs');

let svg = fs.readFileSync('public/tamilnadu-districts-map.svg', 'utf8');

// Replace water fill and outer backgrounds with transparent
svg = svg.replace(/\.st4\{fill:#D9EBF9;\}/g, '.st4{fill:none;}');
svg = svg.replace(/\.st11\{fill:#C6ECFF;\}/g, '.st11{fill:none;}');
svg = svg.replace(/\.st12\{fill:#C6ECFF;stroke:#0978AB;stroke-miterlimit:3.8637;\}/g, '.st12{fill:none;}');
// Make neighboring state land subtle or transparent
svg = svg.replace(/fill:#f5f5f5;fill-opacity:1/g, 'fill:#1e293b;fill-opacity:0.35');
svg = svg.replace(/pagecolor="#ffffff"/g, 'pagecolor="none"');

fs.writeFileSync('public/tamilnadu-districts-map-clean.svg', svg);
console.log('Clean SVG created with size:', fs.statSync('public/tamilnadu-districts-map-clean.svg').size);

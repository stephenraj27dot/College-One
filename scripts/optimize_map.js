const fs = require('fs');

let svg = fs.readFileSync('public/tamilnadu-districts-map.svg', 'utf8');

// 1. Remove the giant background rectangle for neighboring states (path2925) and ocean fills (st4, st11, st12)
svg = svg.replace(/<path[^>]+id="path2925"[^>]*\/>/gs, '');
svg = svg.replace(/<path[^>]+id="path2927"[^>]*\/>/gs, '');
svg = svg.replace(/\.st4\{fill:#D9EBF9;\}/g, '.st4{fill:none;stroke:none;}');
svg = svg.replace(/\.st11\{fill:#C6ECFF;\}/g, '.st11{fill:none;stroke:none;}');
svg = svg.replace(/\.st12\{fill:#C6ECFF;stroke:#0978AB;stroke-miterlimit:3.8637;\}/g, '.st12{fill:none;stroke:none;}');

// 2. District boundaries stroke
svg = svg.replace(/\.st0\{fill:#FEFEE9;\}/g, '.st0{stroke:#1e293b;stroke-width:1.5;}');
svg = svg.replace(/\.st6\{fill:none;stroke:#646464;stroke-width:1.7008;\}/g, '.st6{fill:none;stroke:#334155;stroke-width:1.5;}');

// 3. Make district names ultra sharp and readable (bold black or crisp dark navy)
svg = svg.replace(/fill:#000000/g, 'fill:#0f172a;font-weight:bold');

// 4. Update viewBox so it fits Tamil Nadu tightly: minX: 10, minY: 0, width: 1450, height: 1970
svg = svg.replace(/viewBox="0 0 1591.1 1975.3"/, 'viewBox="20 10 1440 1960"');

fs.writeFileSync('public/tamilnadu-districts-transparent.svg', svg);
console.log('Done! Generated public/tamilnadu-districts-transparent.svg');

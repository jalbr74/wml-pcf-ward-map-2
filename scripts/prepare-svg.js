const fs = require('fs');

let svg = fs.readFileSync('Affinity Designer/Ward Map 2022.svg', 'utf8');

// Replace instances of "serif:id" with "data-name". Otherwise, the "serif:id" attribute gets stripped out of the svg during optimization
svg = svg.replace(/serif:id="([^"]+)"/g, 'data-name="$1"');

fs.writeFileSync('WardMap2/app/ward-map/ward-map.svg', svg);

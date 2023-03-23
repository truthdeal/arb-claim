const fs = require('fs');

let config = { 
    nonce: 18,
    start: false, 
    arbclaimed: false,
};
 
let data = JSON.stringify(config);
fs.writeFileSync('./config.json', data);
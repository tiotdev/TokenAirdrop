const dsteem = require('dsteem');
const client = new dsteem.Client('https://api.steemit.com');
const fs = require("fs");

let uniqueAuthor = [];
client.database.call('get_content_replies', ['authorname','permalink']).then(results => {
  results.forEach(function(result) {
    let reputation = 0;
    if(!uniqueAuthor.indexOf(result.author) >= 0)
      reputation = repLog10(result.author_reputation);
      let amountToSend = 0;
      let author = result.author;
      if(reputation >= 30 && reputation < 40) {
        amountToSend = 100;
      } else if(reputation >= 40 && reputation < 50) {
        amountToSend = 150;
      } else if(reputation >= 50 && reputation < 60) {
        amountToSend = 200;
      } else if(reputation >= 60 && reputation < 70) {
        amountToSend = 250;
      } else if(reputation >= 70) {
        amountToSend = 300;
      }
      if(amountToSend > 0) {
        uniqueAuthor.push({author, amountToSend});
      }
  });
  fs.writeFile('ToSend.txt', JSON.stringify(uniqueAuthor), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});

function log10(str) {
    const leadingDigits = parseInt(str.substring(0, 4));
    const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
    const n = str.length - 1;
    return n + (log - parseInt(log));
}

const repLog10 = rep2 => {
    if (rep2 == null) return rep2;
    let rep = String(rep2);
    const neg = rep.charAt(0) === '-';
    rep = neg ? rep.substring(1) : rep;

    let out = log10(rep);
    if (isNaN(out)) out = 0;
    out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
    out = (neg ? -1 : 1) * out;
    out = out * 9 + 25; // 9 points per magnitude. center at 25
    // base-line 0 to darken and < 0 to auto hide (grep rephide)
    out = parseInt(out);
    return out;
};
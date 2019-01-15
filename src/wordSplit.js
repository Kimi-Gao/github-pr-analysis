const fs = require('fs');
const Segment = require('segment');
const POSTAG  = require('segment').POSTAG;
const segment = new Segment();

segment.useDefault();
segment.loadStopwordDict('./data/dict/stopword.txt');
const text = fs.readFileSync('./data/raw.txt', { encoding: 'utf8' });

let rawData = segment.doSegment(text, {
  stripPunctuation: true,
  stripStopword: true
});

const myPostTag = []
const result = {}

const basicProcessedData = rawData.map(v => ({
  w: v.w,
  p: POSTAG.chsName(v.p)
}))

basicProcessedData.forEach(element => {
  if(!myPostTag.includes(element.p)) {
    myPostTag.push(element.p)
    result[element.p] = []
  }
  result[element.p].push(element.w)
});

Object.keys(result).forEach(v => {
  fs.writeFile(`./data/result/${v}.txt`, result[v].join(' / '), 'utf8', (err) => {
    if (err) throw err;
    console.log(`${v}.txt has been saved!`);
  });
})

console.log(result);

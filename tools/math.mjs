// Challenge maths used on every page and PDF.
// Run `node tools/math.mjs` to re-derive and assert every number the site states.
// build.mjs imports this file, so a wrong number stops the build.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

/** 1 + 2 + … + n */
export const tri = (n) => (n * (n + 1)) / 2;

/** Sum of an arithmetic challenge: square k holds k × step. */
export const challengeTotal = (squares, step) => tri(squares) * step;

/** Running total after the first k squares (順番どおり). */
export const cumulative = (k, step) => tri(k) * step;

/** Running total after k squares when going in reverse (逆から): squares n, n-1, … */
export const cumulativeReverse = (k, squares, step) => (tri(squares) - tri(squares - k)) * step;

export const CHALLENGES = {
  '52shuu': { squares: 52, step: 100, total: 137800 },
  '365nichi': { squares: 365, step: 1, total: 66795 },
  '100nichi': { squares: 100, step: 1, total: 5050 },
  '100nichi-10': { squares: 100, step: 10, total: 50500 },
  '100nichi-100': { squares: 100, step: 100, total: 505000 },
  '500en': { squares: 200, step: 0, coin: 500, total: 100000 },
  '100futo': { squares: 100, step: 100, total: 505000 },
  'en-52week': { squares: 52, step: 1, total: 1378 },
  'en-52week-5': { squares: 52, step: 5, total: 6890 },
  'en-100envelope': { squares: 100, step: 1, total: 5050 },
  'ko-52ju': { squares: 52, step: 1000, total: 1378000 },
  'ko-100bongtu': { squares: 100, step: 1000, total: 5050000 },
};

export function verifyAll() {
  // Brute-force sums (independent of the closed form) for every arithmetic challenge.
  for (const [key, c] of Object.entries(CHALLENGES)) {
    if (key === '500en') {
      assert.equal(c.squares * c.coin, c.total, key);
      continue;
    }
    let s = 0;
    for (let k = 1; k <= c.squares; k++) s += k * c.step;
    assert.equal(s, c.total, `${key}: brute force`);
    assert.equal(challengeTotal(c.squares, c.step), c.total, `${key}: closed form`);
  }
  // Values quoted in the texts.
  assert.equal(cumulative(26, 100), 35100); // 52週, first half in order
  assert.equal(cumulativeReverse(26, 52, 100), 102700); // 52週, first half reversed
  assert.equal(cumulative(26, 100) + cumulativeReverse(26, 52, 100), 137800);
  assert.equal(52 * 100, 5200); // last week of 52週
  assert.equal(Math.round(137800 / 12), 11483); // per month average
  assert.equal(Math.round(137800 / 52), 2650); // per week average
  assert.equal(cumulative(31, 1), 496); // 365日: end of January
  assert.equal(cumulative(182, 1), 16653); // 365日: half year
  assert.equal(365 * 366 / 2, 66795);
  assert.equal(66795 + 366, 67161); // leap year with 366 squares
  assert.equal(Math.round(66795 / 12), 5566); // 365日 per month average
  assert.equal(cumulative(50, 1), 1275); // 100日: day 50
  assert.equal(cumulative(50, 100), 127500); // 100封筒: half
  assert.equal(Math.round(505000 / 100), 5050); // 100封筒: average per envelope
  assert.equal(200 * 7.1, 1420); // 500円玉 200 coins weight (new coin 7.1 g)
  assert.equal(20 * 500, 10000);
  assert.equal(100 * 500, 50000);
  assert.equal(400 * 500, 200000);
  assert.equal(Math.ceil(200 / 3), 67); // 3 coins a week → weeks
  assert.equal(tri(100) - tri(90), 955); // 100日: last 10 days
  assert.equal(1378 * 10, 13780);
  assert.equal(1378 * 1000, 1378000);
  assert.equal(66795 * 10, 667950);
  assert.equal(66795 / 365, 183);
  assert.equal(tri(52) * 10, 13780); // en $10 steps
  assert.equal(tri(100) * 0.5, 2525); // en $0.50
  assert.equal(tri(100) * 2, 10100); // en $2
  assert.equal(1378 * 500, 689000); // ko 52주 500원
  assert.equal(1378 * 2000, 2756000);
  assert.equal(tri(100) * 100, 505000); // ko 100봉투 100원
  assert.equal(tri(100) * 500, 2525000);
  // つもり貯金 examples
  assert.equal(500 * 3 * 52, 78000);
  assert.equal(500 * 3 * 4, 6000);
  // English / Korean
  assert.equal(cumulative(26, 1), 351);
  assert.equal(cumulative(26, 1000), 351000);
  assert.equal(cumulative(50, 1), 1275);
  assert.equal(cumulative(50, 1000), 1275000);
  return true;
}

// Japanese-style yen / won / dollar formatting.
export const yen = (n) => '¥' + n.toLocaleString('en-US');
export const won = (n) => '₩' + n.toLocaleString('en-US');
export const usd = (n) => '$' + n.toLocaleString('en-US');

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  verifyAll();
  for (const [k, c] of Object.entries(CHALLENGES)) console.log(k.padEnd(16), c.total.toLocaleString('en-US'));
  console.log('all challenge maths OK');
}

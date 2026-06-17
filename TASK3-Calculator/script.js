let cur = '';
let prev = '';
let op = null;
let reset = false;
let history = [];

const resultEl = document.getElementById('result');
const exprEl = document.getElementById('expr');

function updateDisplay(val) {
  resultEl.textContent = val;
  const len = String(val).length;
  resultEl.className = 'result' + (len > 12 ? ' xs' : len > 8 ? ' sm' : '');
}

function pressNum(n) {
  if (reset) { cur = ''; reset = false; }
  if (cur === '0' && n !== '.') cur = '';
  cur += n;
  updateDisplay(cur || '0');
}

function pressDot() {
  if (reset) { cur = '0'; reset = false; }
  if (!cur.includes('.')) { cur = (cur || '0') + '.'; updateDisplay(cur); }
}

const sym = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function setOp(o) {
  if (cur === '' && prev === '') return;
  if (cur !== '' && prev !== '' && op) runCalc(true);
  op = o;
  prev = cur || prev;
  cur = '';
  exprEl.textContent = prev + ' ' + sym[o];
}

function runCalc(chained = false) {
  if (!op || prev === '') return;
  const a = parseFloat(prev);
  const b = parseFloat(cur || prev);
  let r;
  if (op === '+') r = a + b;
  else if (op === '-') r = a - b;
  else if (op === '*') r = a * b;
  else if (op === '/') {
    if (b === 0) { updateDisplay('Error'); resetState(); return; }
    r = a / b;
  }
  r = Math.round(r * 1e10) / 1e10;
  const expr = `${prev} ${sym[op]} ${cur}`;
  if (!chained) {
    exprEl.textContent = expr + ' =';
    addHistory(expr, String(r));
  }
  updateDisplay(String(r));
  cur = String(r);
  prev = '';
  op = null;
  reset = !chained;
}

function calculate() { runCalc(); }

function resetState() {
  cur = ''; prev = ''; op = null; reset = false;
}

function clearAll() {
  resetState();
  updateDisplay('0');
  exprEl.textContent = '';
}

function toggleSign() {
  if (!cur) return;
  cur = String(parseFloat(cur) * -1);
  updateDisplay(cur);
}

function percent() {
  if (!cur) return;
  cur = String(parseFloat(cur) / 100);
  updateDisplay(cur);
}

function addHistory(expr, result) {
  history.unshift({ expr, result });
  if (history.length > 8) history.pop();
  document.getElementById('histList').innerHTML = history.map(h =>
    `<div class="hist-item">
      <span class="expr-txt">${h.expr}</span>
      <span class="res-txt">= ${h.result}</span>
    </div>`
  ).join('');
}

function clearHistory() {
  history = [];
  document.getElementById('histList').innerHTML = '';
}

// Keyboard support
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') pressNum(e.key);
  else if (e.key === '.') pressDot();
  else if (e.key === '+') setOp('+');
  else if (e.key === '-') setOp('-');
  else if (e.key === '*') setOp('*');
  else if (e.key === '/') { e.preventDefault(); setOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') {
    cur = cur.slice(0, -1);
    updateDisplay(cur || '0');
  }
});
const code = document.querySelector('#code');
const output = document.querySelector('#output');
const examples = { hello: 'let name = "World";\nprint(name);', math: 'let a = 5;\nlet b = 3;\nprint(a + b);\nprint(a * b);' };
document.querySelector('#example').addEventListener('change', event => { code.value = examples[event.target.value]; output.textContent = 'Ready to run.'; });
document.querySelector('#run').addEventListener('click', runCode);
code.addEventListener('keydown', event => { if (event.ctrlKey && event.key === 'Enter') runCode(); });
function getValue(text, variables) {
  text = text.trim();
  if (/^"[^"]*"$/.test(text)) return text.slice(1, -1);
  if (/^\d+(\.\d+)?$/.test(text)) return Number(text);
  if (Object.hasOwn(variables, text)) return variables[text];
  throw new Error('Unknown value: ' + text);
}
function calculate(expression, variables) {
  const parts = expression.match(/"[^"]*"|\d+(?:\.\d+)?|[a-zA-Z_]\w*|[+*/-]/g);
  if (!parts || parts.join('') !== expression.replace(/\s/g, '')) throw new Error('Invalid expression');
  let result = getValue(parts[0], variables);
  for (let i = 1; i < parts.length; i += 2) {
    const next = getValue(parts[i + 1] || '', variables);
    if (parts[i] === '+') result += next;
    else if (parts[i] === '-') result -= next;
    else if (parts[i] === '*') result *= next;
    else if (parts[i] === '/') result /= next;
    else throw new Error('Unknown operator');
  }
  return result;
}
function runCode() {
  const variables = {};
  const results = [];
  try {
    code.value.split('\n').forEach((line, index) => {
      const text = line.trim();
      if (!text) return;
      const declaration = text.match(/^let ([a-zA-Z_]\w*) = (.+);$/);
      const print = text.match(/^print\((.+)\);$/);
      try {
        if (declaration) variables[declaration[1]] = calculate(declaration[2], variables);
        else if (print) results.push(String(calculate(print[1], variables)));
        else throw new Error('Check the syntax');
      } catch (error) { throw new Error('Line ' + (index + 1) + ': ' + error.message); }
    });
    output.textContent = results.join('\n') || 'Program finished with no output.';
  } catch (error) { output.textContent = error.message; }
}

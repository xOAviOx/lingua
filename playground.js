const code = document.querySelector('#code');
const output = document.querySelector('#output');
const examples = {
  hello: 'let name = "World";\nprint(name);',
  math: 'let a = 5;\nlet b = 3;\nprint(a + b);\nprint(a * b);'
};

document.querySelector('#example').addEventListener('change', event => {
  code.value = examples[event.target.value];
  output.textContent = 'Ready to run.';
});

document.querySelector('#run').addEventListener('click', runCode);
code.addEventListener('keydown', event => {
  if (event.ctrlKey && event.key === 'Enter') runCode();
});

function calculate(expression, variables) {
  const tokens = [];
  let position = 0;

  while (position < expression.length) {
    if (/\s/.test(expression[position])) {
      position++;
      continue;
    }

    const part = expression.slice(position).match(/^("[^"]*"|\d+(?:\.\d+)?|[a-zA-Z_]\w*|\*\*|[()+*/%-])/);
    if (!part) throw new Error('Invalid expression');
    tokens.push(part[0]);
    position += part[0].length;
  }

  let index = 0;

  function value() {
    const token = tokens[index++];

    if (token === '-' || token === '+') {
      const number = value();
      if (typeof number !== 'number') throw new Error('Maths needs numbers');
      return token === '-' ? -number : number;
    }

    if (token === '(') {
      const result = addition();
      if (tokens[index++] !== ')') throw new Error('Missing closing bracket');
      return result;
    }

    if (token && token.startsWith('"')) return token.slice(1, -1);
    if (token && /^\d/.test(token)) return Number(token);
    if (Object.hasOwn(variables, token)) return variables[token];
    if (token && /^[a-zA-Z_]\w*$/.test(token)) throw new Error('Unknown variable: ' + token);
    throw new Error('Invalid expression');
  }

  function power() {
    const result = value();
    if (tokens[index] !== '**') return result;

    index++;
    const exponent = power();
    if (typeof result !== 'number' || typeof exponent !== 'number') throw new Error('Maths needs numbers');
    return result ** exponent;
  }

  function multiplication() {
    let result = power();

    while (tokens[index] === '*' || tokens[index] === '/' || tokens[index] === '%') {
      const operator = tokens[index++];
      const next = power();
      if (typeof result !== 'number' || typeof next !== 'number') throw new Error('Maths needs numbers');
      if ((operator === '/' || operator === '%') && next === 0) throw new Error('Cannot divide by zero');
      if (operator === '*') result *= next;
      if (operator === '/') result /= next;
      if (operator === '%') result %= next;
    }

    return result;
  }

  function addition() {
    let result = multiplication();

    while (tokens[index] === '+' || tokens[index] === '-') {
      const operator = tokens[index++];
      const next = multiplication();

      if (operator === '+') {
        result += next;
      } else {
        if (typeof result !== 'number' || typeof next !== 'number') throw new Error('Maths needs numbers');
        result -= next;
      }
    }

    return result;
  }

  const result = addition();
  if (index !== tokens.length) throw new Error('Invalid expression');
  return result;
}

function runCode() {
  const variables = {};
  const results = [];

  try {
    code.value.split('\n').forEach((line, index) => {
      const text = line.trim();
      if (!text) return;

      const declaration = text.match(/^let\s+([a-zA-Z_]\w*)\s*=\s*(.+);$/);
      const print = text.match(/^print\s*\((.+)\);$/);

      try {
        if (declaration) {
          variables[declaration[1]] = calculate(declaration[2], variables);
        } else if (print) {
          results.push(String(calculate(print[1], variables)));
        } else {
          throw new Error('Check the syntax');
        }
      } catch (error) {
        throw new Error('Line ' + (index + 1) + ': ' + error.message);
      }
    });

    output.textContent = results.join('\n') || 'Program finished with no output.';
  } catch (error) {
    output.textContent = error.message;
  }
}

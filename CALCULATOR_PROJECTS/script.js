// DOM Elements
const previousInputDisplay = document.getElementById('previousInput');
const currentInputDisplay = document.getElementById('currentInput');
const historyToggleBtn = document.getElementById('historyToggleBtn');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const noHistory = document.querySelector('.no-history');

// Calculator State
let currentInput = '0';
let previousInput = '';
let currentOperation = null;
let shouldResetInput = false;
let history = [];

// Event Listeners
document.querySelectorAll('.number-btn').forEach(button => {
  button.addEventListener('click', () => {
    handleNumberInput(button.dataset.number);
  });
});

document.querySelectorAll('.operation-btn').forEach(button => {
  button.addEventListener('click', () => {
    handleOperation(button.dataset.operation);
  });
});

document.querySelectorAll('.function-btn').forEach(button => {
  button.addEventListener('click', () => {
    handleFunction(button.dataset.action);
  });
});

historyToggleBtn.addEventListener('click', toggleHistoryPanel);

// Add keyboard support
document.addEventListener('keydown', handleKeyDown);

// Initialize display
updateDisplay();

// Functions
function handleNumberInput(value) {
  if (shouldResetInput) {
    currentInput = '';
    shouldResetInput = false;
  }
  
  // Handle decimal point
  if (value === '.' && currentInput.includes('.')) {
    return;
  }
  
  // Handle initial zero
  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }
  
  updateDisplay();
}

function handleOperation(operation) {
  // If there's a pending operation, calculate it first
  if (currentOperation && previousInput && !shouldResetInput) {
    calculate();
  }
  
  if (operation === 'equals') {
    calculate();
    return;
  }
  
  previousInput = currentInput;
  currentOperation = operation;
  shouldResetInput = true;
  
  updateDisplay();
}

function handleFunction(func) {
  switch(func) {
    case 'clear':
      currentInput = '0';
      previousInput = '';
      currentOperation = null;
      shouldResetInput = false;
      break;
      
    case 'toggleSign':
      if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-') 
          ? currentInput.substring(1) 
          : '-' + currentInput;
      }
      break;
      
    case 'percentage':
      currentInput = (parseFloat(currentInput) / 100).toString();
      break;
  }
  
  updateDisplay();
}

function calculate() {
  if (!previousInput || !currentOperation) {
    return;
  }
  
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  let result = 0;
  
  switch(currentOperation) {
    case 'add':
      result = prev + current;
      break;
    case 'subtract':
      result = prev - current;
      break;
    case 'multiply':
      result = prev * current;
      break;
    case 'divide':
      if (current === 0) {
        currentInput = 'Error';
        previousInput = '';
        currentOperation = null;
        shouldResetInput = true;
        updateDisplay();
        return;
      }
      result = prev / current;
      break;
  }
  
  // Add to history
  const operationSymbol = getOperationSymbol(currentOperation);
  const historyItem = {
    calculation: `${previousInput} ${operationSymbol} ${currentInput}`,
    result: formatResult(result)
  };
  
  history.unshift(historyItem);
  updateHistoryDisplay();
  
  // Format and set the result
  currentInput = formatResult(result);
  previousInput = '';
  currentOperation = null;
  shouldResetInput = true;
  
  updateDisplay();
}

function getOperationSymbol(operation) {
  if (!operation) return "";
  
  const symbols = {
    'add': '+',
    'subtract': '−',
    'multiply': '×',
    'divide': '÷'
  };
  
  return symbols[operation] || '';
}

function formatResult(number) {
  return number.toString().length > 10 
    ? parseFloat(number.toFixed(8)).toString()
    : number.toString();
}

function updateDisplay() {
  currentInputDisplay.textContent = currentInput;
  
  if (previousInput && currentOperation) {
    previousInputDisplay.textContent = `${previousInput} ${getOperationSymbol(currentOperation)}`;
  } else {
    previousInputDisplay.textContent = '';
  }
}

function updateHistoryDisplay() {
  if (history.length === 0) {
    noHistory.style.display = 'block';
    historyList.innerHTML = '';
  } else {
    noHistory.style.display = 'none';
    historyList.innerHTML = '';
    
    history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const calculation = document.createElement('div');
      calculation.className = 'history-calculation';
      calculation.textContent = item.calculation;
      
      const result = document.createElement('div');
      result.className = 'history-result';
      result.textContent = item.result;
      
      historyItem.appendChild(calculation);
      historyItem.appendChild(result);
      historyList.appendChild(historyItem);
    });
  }
}

function toggleHistoryPanel() {
  historyPanel.classList.toggle('open');
  updateHistoryDisplay();
}

function handleKeyDown(e) {
  const key = e.key;
  
  // Numbers and decimal
  if (/^[0-9.]$/.test(key)) {
    handleNumberInput(key);
  }
  
  // Operations
  switch(key) {
    case '+':
      handleOperation('add');
      break;
    case '-':
      handleOperation('subtract');
      break;
    case '*':
      handleOperation('multiply');
      break;
    case '/':
      e.preventDefault(); // Prevent browser's find functionality
      handleOperation('divide');
      break;
    case 'Enter':
    case '=':
      handleOperation('equals');
      break;
    case 'Escape':
      handleFunction('clear');
      break;
    case 'Backspace':
      if (!shouldResetInput && currentInput !== '0') {
        currentInput = currentInput.length > 1 
          ? currentInput.slice(0, -1) 
          : '0';
        updateDisplay();
      }
      break;
  }
}
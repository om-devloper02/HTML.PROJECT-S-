// Initialize variables
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;
let alertThreshold = parseFloat(localStorage.getItem('alertThreshold')) || 80;
let chart = null;

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

// DOM Elements
const voiceBtn = document.getElementById('voiceBtn');
const voiceStatus = document.getElementById('voiceStatus');
const commandInput = document.getElementById('commandInput');
const submitBtn = document.getElementById('submitBtn');
const expenseForm = document.getElementById('expenseForm');
const expensesList = document.getElementById('expensesList');
const monthlyBudgetInput = document.getElementById('monthlyBudget');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const languageSelect = document.getElementById('language');
const alertBox = document.getElementById('alertBox');
const alertThresholdInput = document.getElementById('alertThreshold');
const setThresholdBtn = document.getElementById('setThresholdBtn');

// Voice Recognition Events
voiceBtn.addEventListener('click', () => {
    voiceBtn.classList.add('listening');
    voiceStatus.textContent = '🎤 Listening...';
    recognition.start();
});

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    commandInput.value = transcript;
    processCommand(transcript);
};

recognition.onend = () => {
    voiceBtn.classList.remove('listening');
    voiceStatus.textContent = 'Ready to listen...';
};

recognition.onerror = (event) => {
    voiceStatus.textContent = `Error: ${event.error}`;
    voiceBtn.classList.remove('listening');
};

// Submit Button
submitBtn.addEventListener('click', () => {
    const command = commandInput.value.toLowerCase();
    if (command) {
        processCommand(command);
        commandInput.value = '';
    }
});

// Process Voice Commands
function processCommand(command) {
    if (command.includes('add expense') || command.includes('add')) {
        handleVoiceExpense(command);
    } else if (command.includes('budget left') || command.includes('remaining')) {
        speakResponse(`You have ₹${getRemainingBudget()} remaining this month.`);
    } else if (command.includes('total spent') || command.includes('spent')) {
        speakResponse(`You have spent ₹${getTotalSpent()} this month.`);
    } else if (command.includes('show expenses') || command.includes('list')) {
        speakResponse(`You have ${expenses.length} expenses recorded.`);
    } else {
        speakResponse('Command not recognized. Try: add expense, budget left, total spent, or show expenses.');
    }
}

// Handle Voice Expense
function handleVoiceExpense(command) {
    const amountMatch = command.match(/(\d+)/);
    if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        const category = extractCategory(command);
        addExpense(amount, category, 'Voice added');
        speakResponse(`Added ₹${amount} expense in ${category} category.`);
    }
}

// Extract Category from Command
function extractCategory(command) {
    const categories = ['food', 'transport', 'entertainment', 'utilities', 'shopping', 'health', 'education'];
    for (let cat of categories) {
        if (command.includes(cat)) return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
    return 'Other';
}

// Text-to-Speech
function speakResponse(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageSelect.value;
    window.speechSynthesis.speak(utterance);
}

// Add Expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    
    if (amount && category) {
        addExpense(amount, category, description);
        expenseForm.reset();
    }
});

function addExpense(amount, category, description) {
    const expense = {
        id: Date.now(),
        amount,
        category,
        description,
        date: new Date().toLocaleDateString()
    };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateUI();
}

// Set Monthly Budget
setBudgetBtn.addEventListener('click', () => {
    const budget = parseFloat(monthlyBudgetInput.value);
    if (budget > 0) {
        monthlyBudget = budget;
        localStorage.setItem('monthlyBudget', monthlyBudget);
        updateUI();
        speakResponse(`Monthly budget set to ₹${budget}`);
    }
});

// Calculate Totals
function getTotalSpent() {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

function getRemainingBudget() {
    return Math.max(0, monthlyBudget - getTotalSpent());
}

// Update UI
function updateUI() {
    updateBudgetCards();
    updateExpensesList();
    updateChart();
    checkBudgetAlert();
}

function updateBudgetCards() {
    const totalSpent = getTotalSpent();
    const remaining = getRemainingBudget();
    
    document.getElementById('totalBudget').textContent = `₹${monthlyBudget.toFixed(2)}`;
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toFixed(2)}`;
    document.getElementById('remaining').textContent = `₹${remaining.toFixed(2)}`;
    
    if (remaining < 0) {
        document.getElementById('remaining').style.color = '#e74c3c';
    } else {
        document.getElementById('remaining').style.color = '#27ae60';
    }
}

function updateExpensesList() {
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="empty-message">No expenses yet. Add one to get started!</p>';
        return;
    }
    
    expensesList.innerHTML = expenses.map(exp => `
        <div class="expense-item">
            <div class="expense-info">
                <h4>${exp.description || 'Expense'}</h4>
                <p>${exp.date}</p>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="expense-category">${exp.category}</span>
                <span class="expense-amount">₹${exp.amount.toFixed(2)}</span>
                <button onclick="deleteExpense(${exp.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateUI();
}

// Update Chart
function updateChart() {
    const categoryData = {};
    expenses.forEach(exp => {
        categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
    });
    
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#4facfe',
                    '#00f2fe',
                    '#43e97b',
                    '#fa709a',
                    '#fee140'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

// Set Alert Threshold
setThresholdBtn.addEventListener('click', () => {
    const threshold = parseFloat(alertThresholdInput.value);
    if (threshold >= 0 && threshold <= 100) {
        alertThreshold = threshold;
        localStorage.setItem('alertThreshold', alertThreshold);
        speakResponse(`Alert threshold set to ${threshold} percent.`);
    }
});

// Check Budget Alert
function checkBudgetAlert() {
    if (monthlyBudget === 0) return;
    
    const totalSpent = getTotalSpent();
    const percentageSpent = (totalSpent / monthlyBudget) * 100;
    
    if (percentageSpent >= 100) {
        showAlert(`⚠️ BUDGET EXCEEDED! You have spent ₹${totalSpent.toFixed(2)} out of ₹${monthlyBudget.toFixed(2)}`, 'danger');
        speakResponse(`Warning! Your budget has been exceeded.`);
    } else if (percentageSpent >= alertThreshold) {
        showAlert(`⚠️ BUDGET ALERT! You have spent ${percentageSpent.toFixed(1)}% of your budget (₹${totalSpent.toFixed(2)} out of ₹${monthlyBudget.toFixed(2)})`, 'warning');
        speakResponse(`Alert! You have spent ${percentageSpent.toFixed(0)} percent of your budget.`);
    } else {
        alertBox.style.display = 'none';
    }
}

function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert-box ${type}`;
    alertBox.style.display = 'block';
}

// Export to CSV
function exportToCSV() {
    if (expenses.length === 0) {
        speakResponse('No expenses to export.');
        return;
    }
    
    let csv = 'Date,Description,Category,Amount\n';
    expenses.forEach(exp => {
        csv += `${exp.date},${exp.description},${exp.category},${exp.amount}\n`;
    });
    csv += `\nTotal Budget,${monthlyBudget}\nTotal Spent,${getTotalSpent()}\nRemaining,${getRemainingBudget()}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    speakResponse('Expense report downloaded successfully.');
}

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', exportToCSV);
}

// Language Change
languageSelect.addEventListener('change', (e) => {
    recognition.lang = e.target.value;
});

// Initialize
updateUI();
monthlyBudgetInput.value = monthlyBudget;
alertThresholdInput.value = alertThreshold;

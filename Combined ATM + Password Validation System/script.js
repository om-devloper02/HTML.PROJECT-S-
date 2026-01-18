// Users Database
const users = {
    "325689744563": { password: "Omkar!@123", balance: 20000.52 },
    "985232459645": { password: "jay@321", balance: 15000.00 },
    "756285456391": { password: "rahul#999", balance: 30000.75 }
};

// State Management
let loginAttempts = {};
let lockedAccounts = new Set();
let currentAccount = null;
let lastTransaction = null;
let transactionHistory = {};
let sessionTimer = null;
let sessionTimeRemaining = 300; // 5 minutes in seconds
let soundEnabled = true;
let darkMode = false;

// Initialize login attempts and transaction history
Object.keys(users).forEach(acc => {
    loginAttempts[acc] = 0;
    transactionHistory[acc] = [];
});

// Load locked accounts from localStorage
function loadLockedAccounts() {
    const stored = localStorage.getItem('lockedAccounts');
    if (stored) {
        lockedAccounts = new Set(JSON.parse(stored));
    }
}

// Save locked accounts to localStorage
function saveLockedAccounts() {
    localStorage.setItem('lockedAccounts', JSON.stringify([...lockedAccounts]));
}

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Initialize App
function initApp() {
    loadLockedAccounts();
    loadTransactionHistory();
    loadUserPreferences();
    showCardReading();
    setupEventListeners();
}

// Load transaction history from localStorage
function loadTransactionHistory() {
    const stored = localStorage.getItem('transactionHistory');
    if (stored) {
        transactionHistory = JSON.parse(stored);
    }
}

// Save transaction history to localStorage
function saveTransactionHistory() {
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
}

// Add transaction to history
function addToHistory(type, amount, balance) {
    const transaction = {
        date: new Date().toISOString(),
        type: type,
        amount: amount,
        balance: balance
    };
    
    if (!transactionHistory[currentAccount]) {
        transactionHistory[currentAccount] = [];
    }
    
    transactionHistory[currentAccount].unshift(transaction);
    
    // Keep only last 10 transactions
    if (transactionHistory[currentAccount].length > 10) {
        transactionHistory[currentAccount] = transactionHistory[currentAccount].slice(0, 10);
    }
    
    saveTransactionHistory();
}

// Sound Effects
function playSound(type) {
    if (!soundEnabled) return;
    
    const audio = document.getElementById(type === 'click' ? 'clickSound' : 'successSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {}); // Ignore errors
    }
}

// Load user preferences
function loadUserPreferences() {
    const theme = localStorage.getItem('darkMode');
    if (theme === 'true') {
        darkMode = true;
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }
    
    const sound = localStorage.getItem('soundEnabled');
    if (sound === 'false') {
        soundEnabled = false;
        updateSoundIcon();
    }
}

// Save user preferences
function saveUserPreferences() {
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('soundEnabled', soundEnabled);
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Sound toggle
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', toggleSound);
    }
    
    // Fast cash buttons
    document.querySelectorAll('.fast-cash-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            playSound('click');
            processFastCash(parseFloat(this.dataset.amount));
        });
    });
    
    // Back from fast cash
    const backFromFastCash = document.getElementById('backFromFastCash');
    if (backFromFastCash) {
        backFromFastCash.addEventListener('click', () => {
            playSound('click');
            showScreen('atmMenuScreen');
        });
    }
    
    // Back from history
    const backFromHistory = document.getElementById('backFromHistory');
    if (backFromHistory) {
        backFromHistory.addEventListener('click', () => {
            playSound('click');
            showScreen('atmMenuScreen');
        });
    }
}

// Toggle Dark Mode
function toggleTheme() {
    playSound('click');
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    updateThemeIcon();
    saveUserPreferences();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = darkMode ? '☀️' : '🌙';
    }
}

// Toggle Sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundIcon();
    saveUserPreferences();
    playSound('click');
}

function updateSoundIcon() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    }
}

// Session Timer
function startSessionTimer() {
    sessionTimeRemaining = 300; // Reset to 5 minutes
    updateTimerDisplay();
    
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }
    
    sessionTimer = setInterval(() => {
        sessionTimeRemaining--;
        updateTimerDisplay();
        
        if (sessionTimeRemaining <= 0) {
            clearInterval(sessionTimer);
            handleSessionTimeout();
        } else if (sessionTimeRemaining === 30) {
            alert('Your session will expire in 30 seconds!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(sessionTimeRemaining / 60);
    const seconds = sessionTimeRemaining % 60;
    const display = document.getElementById('timerDisplay');
    if (display) {
        display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function resetSessionTimer() {
    sessionTimeRemaining = 300;
    updateTimerDisplay();
}

function handleSessionTimeout() {
    alert('Session expired due to inactivity. Please login again.');
    handleExit();
}

function stopSessionTimer() {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
}

// Card Reading Animation
function showCardReading() {
    showScreen('cardReadingScreen');
    const messages = [
        "Welcome to ATM Machine",
        "Please insert card and hold steadily...",
        "Reading card...",
        "Card read successfully!"
    ];
    
    let index = 0;
    const messageElement = document.getElementById('cardMessage');
    
    const interval = setInterval(() => {
        if (index < messages.length) {
            messageElement.textContent = messages[index];
            index++;
        } else {
            clearInterval(interval);
            setTimeout(() => showScreen('loginScreen'), 1000);
        }
    }, 1500);
}

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    const attemptsElement = document.getElementById('attemptsRemaining');
    
    // Clear previous messages
    errorElement.classList.remove('show');
    attemptsElement.classList.remove('show');
    
    // Check if account exists
    if (!users[accountNumber]) {
        errorElement.textContent = 'Invalid account number. Please try again.';
        errorElement.classList.add('show');
        return;
    }
    
    // Check if account is locked
    if (lockedAccounts.has(accountNumber)) {
        showScreen('lockedScreen');
        return;
    }
    
    // Verify password
    if (password === users[accountNumber].password) {
        // Successful login
        currentAccount = accountNumber;
        loginAttempts[accountNumber] = 0;
        document.getElementById('accountDisplay').textContent = accountNumber;
        
        // Show processing message
        errorElement.classList.remove('show');
        attemptsElement.textContent = 'Login successful! Please wait...';
        attemptsElement.style.background = '#d1fae5';
        attemptsElement.style.color = '#10b981';
        attemptsElement.classList.add('show');
        
        setTimeout(() => {
            showScreen('atmMenuScreen');
            // Reset form
            document.getElementById('loginForm').reset();
            attemptsElement.classList.remove('show');
            // Start session timer
            startSessionTimer();
        }, 2000);
    } else {
        // Failed login
        loginAttempts[accountNumber]++;
        const remainingAttempts = 3 - loginAttempts[accountNumber];
        
        if (remainingAttempts > 0) {
            errorElement.textContent = 'Incorrect password. Please try again.';
            errorElement.classList.add('show');
            attemptsElement.textContent = `Attempts remaining: ${remainingAttempts}/3`;
            attemptsElement.classList.add('show');
        } else {
            // Lock account
            lockedAccounts.add(accountNumber);
            saveLockedAccounts();
            showScreen('lockedScreen');
        }
    }
});

// Toggle Password Visibility
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

// ATM Menu Handlers
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        playSound('click');
        resetSessionTimer();
        const action = this.dataset.action;
        
        switch(action) {
            case 'balance':
                showBalanceInquiry();
                break;
            case 'withdraw':
                showWithdrawScreen();
                break;
            case 'deposit':
                showDepositScreen();
                break;
            case 'fastcash':
                showFastCashScreen();
                break;
            case 'history':
                showTransactionHistory();
                break;
            case 'exit':
                handleExit();
                break;
        }
    });
});

// Balance Inquiry
function showBalanceInquiry() {
    const balance = users[currentAccount].balance;
    lastTransaction = {
        type: "Balance Inquiry",
        amount: 0,
        balance: balance
    };
    
    addToHistory("Balance Inquiry", 0, balance);
    
    document.getElementById('transactionTitle').textContent = '💰 Balance Inquiry';
    document.getElementById('transactionContent').innerHTML = `
        <div class="transaction-info">
            <p>Account: ${currentAccount}</p>
            <p>Current Balance:</p>
            <p class="amount">$${balance.toFixed(2)}</p>
        </div>
    `;
    
    document.getElementById('confirmTransaction').style.display = 'none';
    document.getElementById('cancelTransaction').textContent = 'Continue';
    
    showScreen('transactionScreen');
}

// Withdraw Screen
function showWithdrawScreen() {
    document.getElementById('transactionTitle').textContent = '💸 Withdraw Cash';
    document.getElementById('transactionContent').innerHTML = `
        <div class="transaction-info">
            <p>Current Balance: $${users[currentAccount].balance.toFixed(2)}</p>
        </div>
        <div class="form-group">
            <label for="withdrawAmount">Enter amount to withdraw:</label>
            <input type="number" id="withdrawAmount" class="input-field" placeholder="0.00" step="0.01" min="0">
        </div>
        <div id="withdrawError" class="error-message"></div>
    `;
    
    document.getElementById('confirmTransaction').style.display = 'block';
    document.getElementById('confirmTransaction').textContent = 'Withdraw';
    document.getElementById('cancelTransaction').textContent = 'Cancel';
    
    showScreen('transactionScreen');
}

// Deposit Screen
function showDepositScreen() {
    document.getElementById('transactionTitle').textContent = '💵 Deposit Cash';
    document.getElementById('transactionContent').innerHTML = `
        <div class="transaction-info">
            <p>Current Balance: $${users[currentAccount].balance.toFixed(2)}</p>
        </div>
        <div class="form-group">
            <label for="depositAmount">Enter amount to deposit:</label>
            <input type="number" id="depositAmount" class="input-field" placeholder="0.00" step="0.01" min="0">
        </div>
        <div id="depositError" class="error-message"></div>
    `;
    
    document.getElementById('confirmTransaction').style.display = 'block';
    document.getElementById('confirmTransaction').textContent = 'Deposit';
    document.getElementById('cancelTransaction').textContent = 'Cancel';
    
    showScreen('transactionScreen');
}

// Confirm Transaction
document.getElementById('confirmTransaction').addEventListener('click', function() {
    const title = document.getElementById('transactionTitle').textContent;
    
    if (title.includes('Withdraw')) {
        processWithdrawal();
    } else if (title.includes('Deposit')) {
        processDeposit();
    }
});

// Process Withdrawal
function processWithdrawal() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const errorElement = document.getElementById('withdrawError');
    const balance = users[currentAccount].balance;
    
    errorElement.classList.remove('show');
    
    if (!amount || amount <= 0) {
        errorElement.textContent = 'Please enter a valid amount.';
        errorElement.classList.add('show');
        return;
    }
    
    if (amount > balance) {
        errorElement.textContent = 'Insufficient balance. Please enter a lower amount.';
        errorElement.classList.add('show');
        return;
    }
    
    // Process withdrawal
    users[currentAccount].balance -= amount;
    lastTransaction = {
        type: "Cash Withdrawal",
        amount: amount,
        balance: users[currentAccount].balance
    };
    
    addToHistory("Cash Withdrawal", amount, users[currentAccount].balance);
    playSound('success');
    showReceiptPrompt();
}

// Process Deposit
function processDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const errorElement = document.getElementById('depositError');
    
    errorElement.classList.remove('show');
    
    if (!amount || amount <= 0) {
        errorElement.textContent = 'Please enter a valid amount.';
        errorElement.classList.add('show');
        return;
    }
    
    // Process deposit
    users[currentAccount].balance += amount;
    lastTransaction = {
        type: "Cash Deposit",
        amount: amount,
        balance: users[currentAccount].balance
    };
    
    addToHistory("Cash Deposit", amount, users[currentAccount].balance);
    playSound('success');
    showReceiptPrompt();
}

// Cancel Transaction
document.getElementById('cancelTransaction').addEventListener('click', function() {
    const title = document.getElementById('transactionTitle').textContent;
    
    if (title.includes('Balance Inquiry')) {
        showReceiptPrompt();
    } else {
        showScreen('atmMenuScreen');
    }
});

// Show Receipt Prompt
function showReceiptPrompt() {
    const confirmed = confirm('Would you like to print a receipt?');
    
    if (confirmed) {
        showReceipt();
    } else {
        showScreen('atmMenuScreen');
    }
}

// Show Receipt
function showReceipt() {
    const now = new Date();
    const dateStr = now.toLocaleString();
    
    let receiptHTML = `
        <div class="receipt-header">
            <h2>ATM Receipt</h2>
        </div>
        <div class="receipt-body">
            <div class="receipt-row">
                <span>Date:</span>
                <strong>${dateStr}</strong>
            </div>
            <div class="receipt-row">
                <span>Account:</span>
                <strong>${currentAccount}</strong>
            </div>
            <div class="receipt-row">
                <span>Transaction:</span>
                <strong>${lastTransaction.type}</strong>
            </div>
    `;
    
    if (lastTransaction.type === "Cash Withdrawal") {
        receiptHTML += `
            <div class="receipt-row">
                <span>Amount Withdrawn:</span>
                <strong>$${lastTransaction.amount.toFixed(2)}</strong>
            </div>
        `;
    } else if (lastTransaction.type === "Cash Deposit") {
        receiptHTML += `
            <div class="receipt-row">
                <span>Amount Deposited:</span>
                <strong>$${lastTransaction.amount.toFixed(2)}</strong>
            </div>
        `;
    }
    
    receiptHTML += `
            <div class="receipt-row">
                <span>Balance:</span>
                <strong>$${lastTransaction.balance.toFixed(2)}</strong>
            </div>
        </div>
        <div class="receipt-footer">
            <p>Thank you for using our ATM!</p>
            <p>Please keep this receipt for your records.</p>
        </div>
    `;
    
    document.getElementById('receiptContent').innerHTML = receiptHTML;
    showScreen('receiptScreen');
}

// Print Receipt
document.getElementById('printReceipt').addEventListener('click', function() {
    window.print();
});

// Back to Menu
document.getElementById('backToMenu').addEventListener('click', function() {
    showScreen('atmMenuScreen');
});

// Fast Cash Screen
function showFastCashScreen() {
    document.getElementById('fastCashBalance').textContent = users[currentAccount].balance.toFixed(2);
    showScreen('fastCashScreen');
}

// Process Fast Cash
function processFastCash(amount) {
    const balance = users[currentAccount].balance;
    
    if (amount > balance) {
        alert(`Insufficient balance. Your current balance is $${balance.toFixed(2)}`);
        return;
    }
    
    // Process withdrawal
    users[currentAccount].balance -= amount;
    lastTransaction = {
        type: "Fast Cash Withdrawal",
        amount: amount,
        balance: users[currentAccount].balance
    };
    
    addToHistory("Fast Cash", amount, users[currentAccount].balance);
    playSound('success');
    showReceiptPrompt();
}

// Transaction History
function showTransactionHistory() {
    const historyContent = document.getElementById('historyContent');
    const history = transactionHistory[currentAccount] || [];
    
    if (history.length === 0) {
        historyContent.innerHTML = `
            <div class="no-history">
                <p class="large-text">📭</p>
                <p>No transactions found</p>
                <p class="info-text">Your recent transactions will appear here</p>
            </div>
        `;
    } else {
        let historyHTML = '<div class="history-timeline">';
        
        history.forEach((txn, index) => {
            const date = new Date(txn.date);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            
            let icon = '💰';
            let amountClass = '';
            let amountSign = '';
            
            if (txn.type.includes('Withdrawal') || txn.type.includes('Fast Cash')) {
                icon = '💸';
                amountClass = 'amount-negative';
                amountSign = '-';
            } else if (txn.type.includes('Deposit')) {
                icon = '💵';
                amountClass = 'amount-positive';
                amountSign = '+';
            }
            
            historyHTML += `
                <div class="history-item">
                    <div class="history-icon">${icon}</div>
                    <div class="history-details">
                        <div class="history-header">
                            <span class="history-type">${txn.type}</span>
                            ${txn.amount > 0 ? `<span class="history-amount ${amountClass}">${amountSign}$${txn.amount.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="history-meta">
                            <span>${dateStr} ${timeStr}</span>
                            <span class="history-balance">Balance: $${txn.balance.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        historyHTML += '</div>';
        historyContent.innerHTML = historyHTML;
    }
    
    showScreen('historyScreen');
}

// Handle Exit
function handleExit() {
    stopSessionTimer();
    showScreen('exitScreen');
    
    const messages = [
        "Thank you for using our ATM!",
        "Please take your card...",
        "Please take your card.",
        "Goodbye!"
    ];
    
    let index = 0;
    const messageElement = document.getElementById('exitMessage');
    
    const interval = setInterval(() => {
        if (index < messages.length) {
            messageElement.textContent = messages[index];
            index++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                currentAccount = null;
                lastTransaction = null;
                stopSessionTimer();
                showCardReading();
            }, 2000);
        }
    }, 2000);
}

// Back to Start (from locked screen)
document.getElementById('backToStart').addEventListener('click', function() {
    document.getElementById('loginForm').reset();
    showCardReading();
});

// Initialize app on page load
window.addEventListener('DOMContentLoaded', initApp);
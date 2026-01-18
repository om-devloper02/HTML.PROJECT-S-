# Budget & Expense Voice Assistant

A simple AI-powered financial management application with voice input support.

## Features
- User authentication (Register/Login)
- Add expenses with categories
- Voice input for expense descriptions
- Monthly budget tracking
- Expense reports by category
- Real-time budget status

## Setup

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Application
```bash
python app.py
```

The app will run on `http://localhost:5000`

## Usage

1. **Register**: Create a new account with username and password
2. **Login**: Sign in with your credentials
3. **Add Expenses**: 
   - Enter amount, select category, add description
   - Use 🎤 button for voice input
4. **Set Budget**: Go to Budget tab and set your monthly budget
5. **View Reports**: Check expense breakdown by category

## Project Structure
```
budget_assistant/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── style.css         # Styling
    └── script.js         # Frontend logic
```

## Database
Uses SQLite with tables:
- **users**: User credentials
- **expenses**: Expense records
- **budget**: Monthly budget limits

## Technologies
- Backend: Python, Flask
- Frontend: HTML5, CSS3, JavaScript
- Database: SQLite
- Voice: Web Speech API

## Notes
- Voice input requires HTTPS or localhost
- Budget calculations are monthly
- All amounts in ₹ (Indian Rupees)

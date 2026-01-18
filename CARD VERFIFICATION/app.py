from flask import Flask, render_template, request, jsonify, send_file
from datetime import datetime
import csv
import io

app = Flask(__name__)
validation_history = []

# BIN Database (Bank Identification Number) - Indian Banks & International
BIN_DATABASE = {
    # SBI (State Bank of India)
    '506290': 'SBI - State Bank of India',
    '506291': 'SBI - State Bank of India',
    '506292': 'SBI - State Bank of India',
    '506293': 'SBI - State Bank of India',
    '506294': 'SBI - State Bank of India',
    '506295': 'SBI - State Bank of India',
    '506296': 'SBI - State Bank of India',
    '506297': 'SBI - State Bank of India',
    '506298': 'SBI - State Bank of India',
    '506299': 'SBI - State Bank of India',
    '506': 'SBI - State Bank of India',
    
    # Kotak Bank
    '505290': 'Kotak Mahindra Bank',
    '505291': 'Kotak Mahindra Bank',
    '505292': 'Kotak Mahindra Bank',
    '505293': 'Kotak Mahindra Bank',
    '505294': 'Kotak Mahindra Bank',
    '505295': 'Kotak Mahindra Bank',
    '505296': 'Kotak Mahindra Bank',
    '505297': 'Kotak Mahindra Bank',
    '505298': 'Kotak Mahindra Bank',
    '505299': 'Kotak Mahindra Bank',
    '505': 'Kotak Mahindra Bank',
    
    # Central Bank of India
    '504290': 'Central Bank of India',
    '504291': 'Central Bank of India',
    '504292': 'Central Bank of India',
    '504293': 'Central Bank of India',
    '504294': 'Central Bank of India',
    '504295': 'Central Bank of India',
    '504296': 'Central Bank of India',
    '504297': 'Central Bank of India',
    '504298': 'Central Bank of India',
    '504299': 'Central Bank of India',
    '504': 'Central Bank of India',
    
    # RBI (Reserve Bank of India)
    '507290': 'RBI - Reserve Bank of India',
    '507291': 'RBI - Reserve Bank of India',
    '507292': 'RBI - Reserve Bank of India',
    '507293': 'RBI - Reserve Bank of India',
    '507294': 'RBI - Reserve Bank of India',
    '507295': 'RBI - Reserve Bank of India',
    '507296': 'RBI - Reserve Bank of India',
    '507297': 'RBI - Reserve Bank of India',
    '507298': 'RBI - Reserve Bank of India',
    '507299': 'RBI - Reserve Bank of India',
    '507': 'RBI - Reserve Bank of India',
    
    # HDFC Bank
    '453201': 'HDFC Bank',
    '453202': 'HDFC Bank',
    '453': 'HDFC Bank',
    
    # International Cards
    '601111': 'Discover Bank',
    '511111': 'Mastercard Bank',
    '411111': 'Visa Bank',
    '601': 'Discover',
    '511': 'Mastercard',
    '411': 'Visa',
    '4': 'Visa',
    '5': 'Mastercard',
    '6': 'Discover',
    '3': 'American Express'
}

def get_bin_bank(card_number):
    """Get bank name from BIN (first 6 digits)"""
    card_number = ''.join(filter(str.isdigit, str(card_number)))
    if len(card_number) < 6:
        return 'Unknown'
    
    bin_6 = card_number[:6]
    bin_3 = card_number[:3]
    bin_1 = card_number[:1]
    
    if bin_6 in BIN_DATABASE:
        return BIN_DATABASE[bin_6]
    elif bin_3 in BIN_DATABASE:
        return BIN_DATABASE[bin_3]
    elif bin_1 in BIN_DATABASE:
        return BIN_DATABASE[bin_1]
    return 'Unknown Bank'

def get_card_type(card_number):
    """Detect card type based on first digits"""
    card_number = ''.join(filter(str.isdigit, str(card_number)))
    if card_number.startswith('4'):
        return 'Visa'
    elif card_number.startswith('5'):
        return 'Mastercard'
    elif card_number.startswith('3'):
        return 'American Express' if card_number.startswith('34') or card_number.startswith('37') else 'Diners Club'
    elif card_number.startswith('6'):
        return 'Discover'
    return 'Unknown'

def luhn_algorithm(card_number):
    """Validates a card number using the Luhn Algorithm"""
    card_number = ''.join(filter(str.isdigit, str(card_number)))
    
    if len(card_number) < 13 or len(card_number) > 19:
        return False
    
    reversed_digits = card_number[::-1]
    total = 0
    
    for i, digit in enumerate(reversed_digits):
        num = int(digit)
        
        if i % 2 == 1:
            num *= 2
            if num > 9:
                num -= 9
        
        total += num
    
    return total % 10 == 0


@app.route('/')
def index():
    """Load the main page"""
    return render_template('index.html')

@app.route('/history-page')
def history_page():
    """Load the history page"""
    return render_template('history.html')

@app.route('/analytics-page')
def analytics_page():
    """Load the analytics page"""
    return render_template('analytics.html')


@app.route('/verify', methods=['POST'])
def verify():
    """Verify card number only"""
    try:
        data = request.get_json()
        card_number = data.get('card_number', '')
        
        card_type = get_card_type(card_number)
        bank_name = get_bin_bank(card_number)
        luhn_valid = luhn_algorithm(card_number)
        card_length = len(''.join(filter(str.isdigit, str(card_number))))
        
        status = "Valid (Looks Real)" if luhn_valid else "Invalid (Fake)"
        
        result = {
            "status": status,
            "card_type": card_type,
            "bank_name": bank_name,
            "card_length": card_length,
            "luhn_check": "✓" if luhn_valid else "✗"
        }
        
        validation_history.append({
            "card_type": card_type,
            "bank_name": bank_name,
            "status": status,
            "time": datetime.now().strftime("%H:%M:%S"),
            "date": datetime.now().strftime("%Y-%m-%d")
        })
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"status": "Error: Invalid input"}), 400

@app.route('/history', methods=['GET'])
def history():
    """Get validation history"""
    return jsonify({"history": validation_history})

@app.route('/clear-history', methods=['POST'])
def clear_history():
    """Clear validation history"""
    global validation_history
    validation_history = []
    return jsonify({"message": "History cleared successfully"})

@app.route('/stats', methods=['GET'])
def stats():
    """Get statistics"""
    total = len(validation_history)
    valid = sum(1 for item in validation_history if 'Valid' in item['status'])
    invalid = total - valid
    return jsonify({
        "total": total,
        "valid": valid,
        "invalid": invalid,
        "card_length": len(str(validation_history[-1]['card_type'])) if validation_history else 0
    })

@app.route('/analytics', methods=['GET'])
def analytics():
    """Get detailed analytics"""
    total = len(validation_history)
    valid = sum(1 for item in validation_history if 'Valid' in item['status'])
    invalid = total - valid
    success_rate = round((valid / total * 100) if total > 0 else 0)
    
    card_types = {}
    banks = {}
    timeline = {}
    
    for item in validation_history:
        card_type = item.get('card_type', 'Unknown')
        bank = item.get('bank_name', 'Unknown')
        date = item.get('date', 'Unknown')
        
        card_types[card_type] = card_types.get(card_type, 0) + 1
        banks[bank] = banks.get(bank, 0) + 1
        timeline[date] = timeline.get(date, 0) + 1
    
    return jsonify({
        "total": total,
        "valid": valid,
        "invalid": invalid,
        "success_rate": success_rate,
        "card_types": card_types,
        "banks": banks,
        "timeline": timeline
    })

@app.route('/export', methods=['GET'])
def export_csv():
    """Export validation history as CSV"""
    if not validation_history:
        return jsonify({"error": "No data to export"}), 400
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['Date', 'Time', 'Bank Name', 'Card Type', 'Status'])
    for record in validation_history:
        writer.writerow([
            record.get('date', ''),
            record.get('time', ''),
            record.get('bank_name', ''),
            record.get('card_type', ''),
            record.get('status', '')
        ])
    
    output.seek(0)
    mem = io.BytesIO()
    mem.write(output.getvalue().encode('utf-8'))
    mem.seek(0)
    
    return send_file(
        mem,
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'card_verification_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    )


if __name__ == '__main__':
    app.run(debug=True, port=5000)

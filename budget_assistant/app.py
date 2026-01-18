from flask import Flask, render_template
# from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

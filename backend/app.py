from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.stock_data import search_stocks, get_stock_info, get_stock_history

app = Flask(__name__)
CORS(app)

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    if not query or len(query) < 1:
        return jsonify([])
    
    results = search_stocks(query)
    return jsonify(results)

@app.route('/api/stock/<symbol>', methods=['GET'])
def stock_info(symbol):
    try:
        info = get_stock_info(symbol)
        return jsonify(info)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@app.route('/api/history/<symbol>', methods=['GET'])
def stock_history(symbol):
    period = request.args.get('period', '1y')
    interval = request.args.get('interval', '1d')
    
    try:
        history = get_stock_history(symbol, period, interval)
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@app.route('/api/trending', methods=['GET'])
def trending_stocks():
    # List of popular stocks to display on the homepage
    symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM']
    results = []
    
    for symbol in symbols:
        try:
            info = get_stock_info(symbol, minimal=True)
            results.append(info)
        except:
            continue
            
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)

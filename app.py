from datetime import datetime
from dateutil.relativedelta import relativedelta

from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__, static_url_path='')

FINNHUB_API_KEY = 'cmsaabhr01qlk9b15o5gcmsaabhr01qlk9b15o60'
FINNHUB_BASE_URL_1 = 'https://finnhub.io/api/v1/stock/profile2'
FINNHUB_BASE_URL_2 = 'https://finnhub.io/api/v1/quote'
FINNHUB_BASE_URL_3 = 'https://finnhub.io/api/v1/stock/recommendation'
FINNHUB_BASE_URL_4 = 'https://finnhub.io/api/v1/company-news'

POLYGON_API_KEY = 'H1yqa2g6YarOCvTqnQULhJS7WLPGSp_M'
POLYGON_BASE_URL = 'https://api.polygon.io/v2/aggs'
'''
#this does not work!
@app.route('/')
def index():
    return app.send_static_file('index.html')
'''

@app.route('/search-company', methods=['GET'])
def searchCompany():
    # Get the stock ticker 
    stock_ticker = request.args.get('ticker')
    # Make API request to Finnhub
    params = {'symbol': stock_ticker, 'token': FINNHUB_API_KEY}
    response = requests.get(FINNHUB_BASE_URL_1, params=params)

    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch stock information'})
    
@app.route('/search-stock', methods=['GET'])
def searchStock():
    stock_ticker = request.args.get('ticker')
    params = {'symbol': stock_ticker, 'token': FINNHUB_API_KEY}
    response = requests.get(FINNHUB_BASE_URL_2, params=params)
    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch stock information'})
    
## def searchRecom();

@app.route('/search-chart', methods=['GET'])    
def searchCharts():
    stock_ticker = request.args.get('ticker')
    current_date = datetime.now()
    from_date_chart = current_date - relativedelta(months=6, days=1)
    from_date_chart_formatted = from_date_chart.strftime('%Y-%m-%d')
    to_date_formatted = current_date.strftime('%Y-%m-%d')
    
    endpoint_url = f'{POLYGON_BASE_URL}/ticker/{stock_ticker}/range/1/day/{from_date_chart_formatted}/{to_date_formatted}'
    
    params = {'apiKey': POLYGON_API_KEY, 'adjusted': 'true', 'sort': 'asc'}

    response = requests.get(endpoint_url, params=params)
    if response.status_code == 200:
        data = response.json()
        data['to_date_formatted'] = to_date_formatted
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch stock information'})

@app.route('/search-recom', methods=['GET'])   
def searchRecom():
    stock_ticker = request.args.get('ticker')
    params = {'symbol': stock_ticker, 'token': FINNHUB_API_KEY}
    response = requests.get(FINNHUB_BASE_URL_3, params=params)

    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch stock information'})

@app.route('/search-news', methods=['GET'])    
def searchNews():
    stock_ticker = request.args.get('ticker')
    current_date = datetime.now()
    to_date_formatted = current_date.strftime('%Y-%m-%d')
    from_date_news = current_date - relativedelta(days=30)
    from_data_news_formatted = from_date_news.strftime('%Y-%m-%d')
    params = {'symbol': stock_ticker, 'from': from_data_news_formatted, 'to': to_date_formatted, 'token':FINNHUB_API_KEY}
    response = requests.get(FINNHUB_BASE_URL_4, params=params)

    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({'error': 'Failed to fetch stock information'})

    
if __name__ == '__main__':
    app.run(debug=True)


import yfinance as yf
import pandas as pd
import json

def search_stocks(query):
    """
    Search for stocks by symbol or name
    """
    # This is a simplified implementation
    # In a production app, you would use a more comprehensive database or API
    # for stock symbol lookup
    
    # Common stock tickers for demonstration
    common_stocks = [
        {"symbol": "AAPL", "name": "Apple Inc."},
        {"symbol": "MSFT", "name": "Microsoft Corporation"},
        {"symbol": "GOOGL", "name": "Alphabet Inc."},
        {"symbol": "AMZN", "name": "Amazon.com, Inc."},
        {"symbol": "META", "name": "Meta Platforms, Inc."},
        {"symbol": "TSLA", "name": "Tesla, Inc."},
        {"symbol": "NVDA", "name": "NVIDIA Corporation"},
        {"symbol": "JPM", "name": "JPMorgan Chase & Co."},
        {"symbol": "V", "name": "Visa Inc."},
        {"symbol": "JNJ", "name": "Johnson & Johnson"},
        {"symbol": "WMT", "name": "Walmart Inc."},
        {"symbol": "PG", "name": "Procter & Gamble Co."},
        {"symbol": "MA", "name": "Mastercard Incorporated"},
        {"symbol": "UNH", "name": "UnitedHealth Group Incorporated"},
        {"symbol": "HD", "name": "The Home Depot, Inc."},
    ]
    
    query = query.lower()
    results = [
        stock for stock in common_stocks
        if query in stock["symbol"].lower() or query in stock["name"].lower()
    ]
    
    return results[:10]  # Limit to 10 results

def get_stock_info(symbol, minimal=False):
    """
    Get detailed information about a stock
    """
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        # Handle different data structures from yfinance
        if minimal:
            return {
                "symbol": symbol,
                "name": info.get("shortName", info.get("longName", symbol)),
                "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
                "change": info.get("regularMarketChangePercent", 0),
                "currency": info.get("currency", "USD"),
            }
        
        # Full information
        return {
            "symbol": symbol,
            "name": info.get("shortName", info.get("longName", symbol)),
            "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
            "change": info.get("regularMarketChangePercent", 0),
            "currency": info.get("currency", "USD"),
            "marketCap": info.get("marketCap", 0),
            "volume": info.get("volume", 0),
            "averageVolume": info.get("averageVolume", 0),
            "high": info.get("dayHigh", info.get("regularMarketDayHigh", 0)),
            "low": info.get("dayLow", info.get("regularMarketDayLow", 0)),
            "open": info.get("open", info.get("regularMarketOpen", 0)),
            "previousClose": info.get("previousClose", info.get("regularMarketPreviousClose", 0)),
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh", 0),
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow", 0),
            "trailingPE": info.get("trailingPE", 0),
            "forwardPE": info.get("forwardPE", 0),
            "dividendYield": info.get("dividendYield", 0) * 100 if info.get("dividendYield") else 0,
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
            "website": info.get("website", ""),
            "description": info.get("longBusinessSummary", ""),
        }
    except Exception as e:
        raise Exception(f"Error fetching stock info: {str(e)}")

def get_stock_history(symbol, period='1y', interval='1d'):
    """
    Get historical price data for a stock
    
    Parameters:
    - symbol: Stock symbol
    - period: Valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
    - interval: Valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
    """
    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period=period, interval=interval)
        
        # Convert to list of dictionaries for JSON serialization
        result = []
        for date, row in history.iterrows():
            result.append({
                "date": date.strftime('%Y-%m-%d'),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"]),
            })
        
        return result
    except Exception as e:
        raise Exception(f"Error fetching stock history: {str(e)}")

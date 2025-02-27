/**
 * Utility functions for generating mock data for various components
 * Used as fallback when API requests fail
 */

/**
 * Generate a mock stock details object
 * @param {string} symbol - Stock symbol
 * @returns {Object} Mock stock details
 */
export function generateMockStockDetails(symbol = 'AAPL') {
  // Get base price based on symbol to ensure consistency
  const basePrice = getBasePrice(symbol);
  const change = (Math.random() * 10 - 5).toFixed(2);
  const changePercent = (change / basePrice * 100).toFixed(2);
  
  // Get region information
  const region = getRegionFromSymbol(symbol);
  
  return {
    symbol: symbol,
    name: getCompanyName(symbol),
    price: basePrice,
    change: parseFloat(change),
    changePercent: parseFloat(changePercent),
    currency: region.currency || 'USD',
    exchange: getExchangeFromSymbol(symbol),
    previousClose: basePrice - parseFloat(change),
    open: basePrice - (Math.random() * 2),
    dayLow: basePrice - (Math.random() * 5 + 2),
    dayHigh: basePrice + (Math.random() * 5),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: basePrice * (Math.floor(Math.random() * 1000000000) + 500000000),
    pe: (Math.random() * 30 + 5).toFixed(2),
    yearLow: basePrice * 0.7,
    yearHigh: basePrice * 1.3,
    dividendYield: Math.random() * 0.05,
    region: region.id,
    isMockData: true
  };
}

/**
 * Generate mock stock history data
 * @param {string} symbol - Stock symbol
 * @param {string} range - Time range (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y)
 * @returns {Object} Mock stock history with timestamps and prices
 */
export function generateMockStockHistory(symbol = 'AAPL', range = '1mo') {
  const basePrice = getBasePrice(symbol);
  const timestamps = [];
  const prices = [];
  
  // Determine number of data points based on range
  let dataPoints = 0;
  let startDate = new Date();
  
  switch(range) {
    case '1d':
      dataPoints = 24;
      startDate.setHours(0, 0, 0, 0);
      break;
    case '5d':
      dataPoints = 5 * 8;
      startDate.setDate(startDate.getDate() - 5);
      break;
    case '1mo':
      dataPoints = 30;
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '3mo':
      dataPoints = 90;
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '6mo':
      dataPoints = 180;
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case '1y':
      dataPoints = 365;
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case '5y':
      dataPoints = 5 * 52; // Weekly data points for 5 years
      startDate.setFullYear(startDate.getFullYear() - 5);
      break;
    default:
      dataPoints = 30;
      startDate.setMonth(startDate.getMonth() - 1);
  }
  
  // Generate timestamps and prices
  let currentPrice = basePrice;
  let volatility = basePrice * 0.02; // 2% volatility
  
  // For longer timeframes, increase the trend bias slightly
  let trendBias = 0;
  if (range === '1y' || range === '5y') {
    trendBias = 0.002; // Slight upward bias for longer timeframes
  }
  
  // Ensure we always generate at least 10 data points
  dataPoints = Math.max(dataPoints, 10);
  
  // Use a seeded random function for consistency
  const getConsistentRandom = (seed) => {
    // Simple deterministic random function based on seed
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // Generate data points
  for (let i = 0; i < dataPoints; i++) {
    let date = new Date(startDate);
    
    if (range === '1d') {
      date.setHours(date.getHours() + i);
      // Include all hours for better visualization
      timestamps.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else if (range === '5d') {
      date.setHours(date.getHours() + (i * 3));
      timestamps.push(date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    } else if (range === '5y') {
      date.setDate(date.getDate() + (i * 7)); // Weekly data points
      timestamps.push(date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }));
    } else {
      date.setDate(date.getDate() + i);
      timestamps.push(date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    }
    
    // Create a seed based on symbol, date, and position for consistent randomness
    const seed = symbol.charCodeAt(0) + date.getDate() + i;
    
    // Random walk with slight trend bias for price, but using consistent random
    const change = (getConsistentRandom(seed) - 0.5 + trendBias) * volatility;
    currentPrice += change;
    
    // Ensure price doesn't go negative
    if (currentPrice <= 0) {
      currentPrice = basePrice * 0.1;
    }
    
    prices.push(parseFloat(currentPrice.toFixed(2)));
  }
  
  return {
    symbol,
    timestamps,
    prices,
    isMockData: true
  };
}

/**
 * Generate mock trending stocks
 * @param {number} count - Number of trending stocks to generate
 * @param {string} region - Region code (default: 'US')
 * @returns {Array} Array of mock trending stocks
 */
export function generateMockTrendingStocks(count = 10, region = 'US') {
  const stocks = [];
  const symbols = getSymbolsByRegion(region);
  
  // Ensure we don't try to generate more stocks than we have symbols for
  const actualCount = Math.min(count, symbols.length);
  
  for (let i = 0; i < actualCount; i++) {
    const symbol = symbols[i];
    const basePrice = getBasePrice(symbol);
    const change = (Math.random() * 10 - 3).toFixed(2); // Bias slightly toward positive changes
    const changePercent = (change / basePrice * 100).toFixed(2);
    
    stocks.push({
      symbol: symbol,
      name: getCompanyName(symbol),
      price: basePrice,
      change: parseFloat(change),
      changePercent: parseFloat(changePercent),
      isMockData: true
    });
  }
  
  // Sort by absolute change percent (most movement first)
  return stocks.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
}

/**
 * Generate mock search results
 * @param {string} query - Search query
 * @returns {Array} Array of mock search results
 */
export function generateMockSearchResults(query = '') {
  const results = [];
  const allSymbols = [
    ...getSymbolsByRegion('US'),
    ...getSymbolsByRegion('EG'),
    ...getSymbolsByRegion('SA'),
    ...getSymbolsByRegion('AE'),
    ...getSymbolsByRegion('UK')
  ];
  
  // Filter symbols that match the query
  const filteredSymbols = allSymbols.filter(symbol => 
    symbol.toLowerCase().includes(query.toLowerCase()) || 
    getCompanyName(symbol).toLowerCase().includes(query.toLowerCase())
  );
  
  // Limit to 10 results
  const limitedSymbols = filteredSymbols.slice(0, 10);
  
  for (const symbol of limitedSymbols) {
    results.push({
      symbol: symbol,
      name: getCompanyName(symbol),
      exchange: getExchangeFromSymbol(symbol),
      type: 'Equity',
      isMockData: true
    });
  }
  
  return results;
}

// Helper functions

/**
 * Get base price for a symbol to ensure consistency
 * @param {string} symbol - Stock symbol
 * @returns {number} Base price
 */
function getBasePrice(symbol) {
  const symbolUpperCase = symbol.toUpperCase();
  const prices = {
    'AAPL': 182.52,
    'MSFT': 415.32,
    'GOOGL': 142.65,
    'AMZN': 178.75,
    'TSLA': 175.34,
    'META': 485.58,
    'NVDA': 822.79,
    'JPM': 188.96,
    'COMI.CA': 52.15,
    '2222.SR': 29.85,
    'ETISALAT.AD': 24.50,
    'EMAAR.DU': 7.25,
    'ETEL.CA': 24.32,
    'EAST.CA': 18.75,
    '1120.SR': 89.70,
    'HSBA.L': 620.30,
    'VOD.L': 68.42
  };
  
  return prices[symbolUpperCase] || 150 + Math.random() * 100;
}

/**
 * Get company name for a symbol
 * @param {string} symbol - Stock symbol
 * @returns {string} Company name
 */
function getCompanyName(symbol) {
  const symbolUpperCase = symbol.toUpperCase();
  const names = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'JPM': 'JPMorgan Chase & Co.',
    'COMI.CA': 'Commercial International Bank',
    '2222.SR': 'Saudi Aramco',
    'ETISALAT.AD': 'Emirates Telecommunications Group',
    'EMAAR.DU': 'Emaar Properties',
    'ETEL.CA': 'Telecom Egypt',
    'EAST.CA': 'Eastern Company',
    '1120.SR': 'Al Rajhi Bank',
    'HSBA.L': 'HSBC Holdings',
    'VOD.L': 'Vodafone Group'
  };
  
  return names[symbolUpperCase] || `Company ${symbolUpperCase}`;
}

/**
 * Get symbols by region
 * @param {string} region - Region code
 * @returns {Array} Array of stock symbols for the region
 */
function getSymbolsByRegion(region) {
  switch(region.toUpperCase()) {
    case 'EG':
      return ['COMI.CA', 'ETEL.CA', 'EAST.CA', 'EFIC.CA', 'HRHO.CA'];
    case 'SA':
      return ['2222.SR', '1120.SR', '2010.SR', '1211.SR', '2350.SR'];
    case 'AE':
      return ['ETISALAT.AD', 'EMAAR.DU', 'DIB.DU', 'FAB.AD', 'DFM.DU'];
    case 'UK':
      return ['HSBA.L', 'VOD.L', 'BP.L', 'GSK.L', 'LLOY.L'];
    case 'US':
    default:
      return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'WMT'];
  }
}

/**
 * Determine region from symbol
 * @param {string} symbol - Stock symbol
 * @returns {Object} Region information
 */
function getRegionFromSymbol(symbol) {
  if (symbol.endsWith('.CA')) return { id: 'EG', name: 'Egypt', currency: 'EGP' };
  if (symbol.endsWith('.SR')) return { id: 'SA', name: 'Saudi Arabia', currency: 'SAR' };
  if (symbol.endsWith('.AD') || symbol.endsWith('.DU')) return { id: 'AE', name: 'United Arab Emirates', currency: 'AED' };
  if (symbol.endsWith('.L')) return { id: 'UK', name: 'United Kingdom', currency: 'GBP' };
  return { id: 'US', name: 'United States', currency: 'USD' }; // Default to USA
}

/**
 * Get exchange name from symbol
 * @param {string} symbol - Stock symbol
 * @returns {string} Exchange name
 */
function getExchangeFromSymbol(symbol) {
  if (symbol.endsWith('.CA')) return 'EGX';
  if (symbol.endsWith('.SR')) return 'Tadawul';
  if (symbol.endsWith('.AD')) return 'ADX';
  if (symbol.endsWith('.DU')) return 'DFM';
  if (symbol.endsWith('.L')) return 'LSE';
  if (symbol.includes('.')) return symbol.split('.')[1];
  return 'NASDAQ'; // Default for US stocks
}

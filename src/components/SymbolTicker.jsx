import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSymbol, fetchSymbolDetail } from '../redux/slices/marketDataSlice';
import './SymbolTicker.css';

const fmt = (n) => n?.toFixed(2);

const SymbolTicker = ({ symbol }) => {
  const dispatch = useDispatch();
  const selected = useSelector((s) => s.marketData.selectedSymbol);
  const isActive = selected === symbol.symbol;

  const handleClick = () => {
    dispatch(setSelectedSymbol(symbol.symbol));
    dispatch(fetchSymbolDetail(symbol.symbol));
  };

  return (
    <button
      className={`symbol-ticker ${isActive ? 'symbol-ticker--active' : ''} ${symbol.change >= 0 ? 'pos' : 'neg'}`}
      onClick={handleClick}
    >
      <div className="symbol-ticker__top">
        <span className="symbol-ticker__symbol">{symbol.symbol}</span>
        <span className={`symbol-ticker__change ${symbol.change >= 0 ? 'pos' : 'neg'}`}>
          {symbol.change >= 0 ? '+' : ''}{symbol.changePct}%
        </span>
      </div>
      <div className="symbol-ticker__price">
  {new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(symbol.price)}
</div>
    </button>
  );
};

export default SymbolTicker;

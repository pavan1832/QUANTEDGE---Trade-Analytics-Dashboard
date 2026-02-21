import React from 'react';
import './MetricCard.css';

const MetricCard = ({ label, value, sub, change, changePercent, loading }) => {
  const isPositive = change >= 0;

  if (loading) {
    return (
      <div className="metric-card metric-card--loading">
        <div className="metric-card__label-sk" />
        <div className="metric-card__value-sk" />
        <div className="metric-card__sub-sk" />
      </div>
    );
  }

  return (
    <div className="metric-card">
      <span className="metric-card__label">{label}</span>
      <div className="metric-card__value">{value}</div>
      {sub && <div className="metric-card__sub">{sub}</div>}
      {change !== undefined && (
        <div className={`metric-card__change ${isPositive ? 'pos' : 'neg'}`}>
          <span className="metric-card__arrow">{isPositive ? '▲' : '▼'}</span>
          <span>{Math.abs(change)}</span>
          {changePercent !== undefined && (
            <span className="metric-card__pct">({isPositive ? '+' : ''}{changePercent}%)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;

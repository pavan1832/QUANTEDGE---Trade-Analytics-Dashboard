import React from 'react';
import './ChartContainer.css';

const ChartContainer = ({ title, subtitle, height = 300, children, legend, toolbar }) => {
  return (
    <div className="chart-container">
      <div className="chart-container__header">
        <div className="chart-container__meta">
          {title && <h3 className="chart-container__title">{title}</h3>}
          {subtitle && <span className="chart-container__subtitle">{subtitle}</span>}
        </div>
        {legend && <div className="chart-container__legend">{legend}</div>}
        {toolbar && <div className="chart-container__toolbar">{toolbar}</div>}
      </div>
      <div className="chart-container__body" style={{ height }}>
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;

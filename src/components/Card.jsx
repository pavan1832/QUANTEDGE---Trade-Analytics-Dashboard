import React from 'react';
import './Card.css';

const Card = ({ title, subtitle, children, className = '', actions }) => {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="card__header">
          <div className="card__title-group">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <span className="card__subtitle">{subtitle}</span>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </div>
  );
};

export default Card;

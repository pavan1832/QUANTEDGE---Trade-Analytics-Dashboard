import React from 'react';
import './DataTable.css';

const DataTable = ({ columns, data, loading, emptyMessage = 'No data available', className = '' }) => {
  if (loading) {
    return (
      <div className="table-skeleton">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="table-skeleton__row">
            {columns.map((col) => (
              <div key={col.key} className="table-skeleton__cell" style={{ width: col.width }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`data-table-wrapper ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width, textAlign: col.align || 'left' }}
                className={col.className || ''}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} className="data-table__row">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align || 'left' }}
                    className={col.className || ''}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

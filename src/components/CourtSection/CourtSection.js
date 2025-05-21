import React from 'react';

const CourtSection = React.memo(({ title, data, index, isExpanded, toggleSection }) => {
  const filteredEntries = Object.entries(data || {}).filter(([, value]) => value !== null);

  if (filteredEntries.length === 0) return null;

  return (
    <div className="section-container">
      <div className="section-heading" onClick={() => toggleSection(index, title)}>
        <h3>{title}</h3>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <div className="section-details">
          {filteredEntries.map(([fieldKey, value]) => (
            <p key={fieldKey}>
              <span className="font-medium">{fieldKey}: </span>
              {value.toString()}
            </p>
          ))}
        </div>
      )}
    </div>
  );
});

export default CourtSection;

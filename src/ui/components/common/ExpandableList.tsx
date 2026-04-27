import React, { useState } from 'react';

interface ExpandableListProps<T> {
  items: T[];
  defaultCount?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function ExpandableList<T>({
  items,
  defaultCount = 5,
  renderItem,
  className,
}: ExpandableListProps<T>) {
  const [visible, setVisible] = useState(defaultCount);

  if (items.length === 0) return null;

  const hasMore = items.length > visible;
  const canCollapse = visible > defaultCount;
  const remaining = items.length - visible;

  return (
    <div className={className}>
      {items.slice(0, visible).map((item, index) => renderItem(item, index))}

      {(hasMore || canCollapse) && (
        <div className="show-more-controls">
          {hasMore && (
            <button className="show-btn" onClick={() => setVisible(v => v + defaultCount)}>
              Show {Math.min(defaultCount, remaining)} more
            </button>
          )}
          {canCollapse && (
            <button className="show-btn" onClick={() => setVisible(defaultCount)}>
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
}

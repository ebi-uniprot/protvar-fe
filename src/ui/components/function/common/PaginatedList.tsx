/**
 * Reusable paginated list component with Show More/Less functionality
 */

import React from 'react';

interface PaginatedListProps<T> {
  items: T[];
  visibleCount: number;
  pageSize: number;
  onShowMore: () => void;
  onShowLess: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function PaginatedList<T>({
                                   items,
                                   visibleCount,
                                   pageSize,
                                   onShowMore,
                                   onShowLess,
                                   renderItem
                                 }: PaginatedListProps<T>) {
  return (
    <div className="paginated-list">
      {items.slice(0, visibleCount).map((item, index) => renderItem(item, index))}

      <div style={{ textAlign: 'right' }}>
        {items.length > visibleCount && (
          <button className="show-btn" onClick={onShowMore}>
            Show More
          </button>
        )}
        {visibleCount > pageSize && (
          <button className="show-btn" onClick={onShowLess}>
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}
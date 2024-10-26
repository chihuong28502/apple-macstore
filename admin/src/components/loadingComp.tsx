import React from 'react';
import { Card, Skeleton } from 'antd';

interface SkeletonGridProps {
  rows?: number;      
  items?: number;     
}

const SkeletonGrid: React.FC<SkeletonGridProps> = ({ rows, items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(Number(items))].map((_, index) => (
        <Card key={index} className="w-full">
          <Skeleton active paragraph={{ rows }} />
        </Card>
      ))}
    </div>
  );
};

export default SkeletonGrid;

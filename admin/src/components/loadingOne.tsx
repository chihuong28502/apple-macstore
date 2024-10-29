import { Card, Skeleton } from "antd";
import React from "react";

const SkeletonOne: React.FC<any> = ({ rows }) => {
  return (
      <Card className="w-full my-2">
        <Skeleton active paragraph={{ rows }} />
      </Card>
  );
};

export default SkeletonOne;

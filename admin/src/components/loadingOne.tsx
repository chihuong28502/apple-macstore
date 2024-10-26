import React from "react";
import { Card, Skeleton } from "antd";

const SkeletonOne: React.FC<any> = ({ rows }) => {
  return (
      <Card className="w-full my-2">
        <Skeleton active paragraph={{ rows }} />
      </Card>
  );
};

export default SkeletonOne;

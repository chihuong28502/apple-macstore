

// dùng để tính phân trang
export const calculatePagination = (data: {
  pageSize: number;
  page: number;
  total: number;
}) => {
  const { total, page, pageSize } = data;
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  return {
    startIndex,
    endIndex,
    total,
  };
};



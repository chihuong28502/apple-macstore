export const pathPrivateRouter = [
  {
    path: "bought",
    isPrivate: true,
    children: [
      // {
      //   path: "hihi",
      //   isPrivate: false,
      //   children: [
      //     {
      //       path: "haha",
      //       isPrivate: true,
      //     },
      //   ],
      // },
    ],
  },
  {
    path: "/dashboard",
    roles: ["customer"], // Chỉ cho phép admin truy cập
  },
  {
    path: "/private",
    roles: ["customer"], // Cho phép cả admin và customer truy cập
  },
];

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
    path: "payment",
    isPrivate: true,
  },
  {
    path: "config",
    isPrivate: true,
  },
  {
    path: "api",
    isPrivate: true,
  },
  {
    path: "balance-fluctuations",
    isPrivate: true,
  },
];

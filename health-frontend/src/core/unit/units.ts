interface RouterConfig {
  path: string;
  isPrivate?: boolean;
  children?: RouterConfig[];
}
const isPrivateRouter = (paths: string[], routers: RouterConfig[]): boolean => {
  if (!paths.length) {
    return false;
  }
  const [currentPath, ...remainingPaths] = paths;
  const currentRouter = routers.find((router) => router.path === currentPath);
  if (!currentRouter) {
    return false;
  }

  if (currentRouter.isPrivate) {
    return true;
  }
  if (currentRouter.children) {
    return isPrivateRouter(remainingPaths, currentRouter.children);
  }
  return false;
};
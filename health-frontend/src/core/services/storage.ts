interface StorageMethods {
  get: () => string | null;
  set: (value: string) => void;
  remove: () => void;
}

const SysStorage = (key: string): StorageMethods => {
  return {
    get: () => localStorage.getItem(key),
    set: (value: string) => localStorage.setItem(key, value),
    remove: () => localStorage.removeItem(key),
  };
};
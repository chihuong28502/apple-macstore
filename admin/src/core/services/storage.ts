const SysStorage = (name: string) => {
  return {
    get() {
      return localStorage.getItem(name);
    },
    set(value: string) {
      localStorage.setItem(name, value);
    },
    remove() {
      localStorage.removeItem(name);
    },
  };
};

export default SysStorage;

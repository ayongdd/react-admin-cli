// 设置 localStorage 值，5 秒后过期
// _localStorage.setItem('token', 'abc123', 5000);

// 获取 localStorage 值
// console.log(_localStorage.getItem('token')); // 输出: abc123

// 等待 6 秒后再次获取
// setTimeout(() => {
//   console.log(_localStorage.getItem('token')); // 输出: null（已过期）
// }, 6000);

// 设置 sessionStorage 值，10 秒后过期
// _sessionStorage.setItem('user', { name: 'Alice' }, 10000);

// 获取 sessionStorage 值
// console.log(_sessionStorage.getItem('user')); // 输出: { name: 'Alice' }

interface StorageData {
  value: any // 存储的值
  expire: number | null // 过期时间戳
}

export const _localStorage = {
  /**
   * 设置 localStorage 值，支持过期时间
   * @param key 键名
   * @param value 值
   * @param expire 过期时间（单位：毫秒），可选
   */
  setItem: (key: string, value: any, expire?: number): void => {
    const data: StorageData = {
      value,
      expire: expire ? Date.now() + expire : null
    }
    localStorage.setItem(key, JSON.stringify(data))
  },

  /**
   * 获取 localStorage 值，若已过期则返回 null 并清除该值
   * @param key 键名
   * @returns 存储的值或 null
   */
  getItem: (key: string): any => {
    const item = localStorage.getItem(key)
    if (!item) return null

    const data: StorageData = JSON.parse(item)
    if (data.expire && Date.now() > data.expire) {
      localStorage.removeItem(key)
      return null
    }
    return data.value
  },

  /**
   * 删除指定键值
   * @param key 键名
   */
  removeItem: (key: string): void => {
    localStorage.removeItem(key)
  }
}
type StorageValue = string | number | boolean | object | null;
export const storage = {
  // 获取值（自动反序列化 JSON）
  get<T extends StorageValue>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  },

  // 设置值（自动序列化 JSON）
  set(key: string, value: StorageValue): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  // 删除值
  remove(key: string): void {
    localStorage.removeItem(key);
  },

  // 清空所有值
  clear(): void {
    localStorage.clear();
  },
};

export const _sessionStorage = {
  /**
   * 设置 sessionStorage 值，支持过期时间
   * @param key 键名
   * @param value 值
   * @param expire 过期时间（单位：毫秒），可选
   */
  setItem: (key: string, value: any, expire?: number): void => {
    const data: StorageData = {
      value,
      expire: expire ? Date.now() + expire : null
    }
    sessionStorage.setItem(key, JSON.stringify(data))
  },

  /**
   * 获取 sessionStorage 值，若已过期则返回 null 并清除该值
   * @param key 键名
   * @returns 存储的值或 null
   */
  getItem: (key: string): any => {
    const item = sessionStorage.getItem(key)
    if (!item) return null

    const data: StorageData = JSON.parse(item)
    if (data.expire && Date.now() > data.expire) {
      sessionStorage.removeItem(key)
      return null
    }
    return data.value
  },

  /**
   * 删除指定键值
   * @param key 键名
   */
  removeItem: (key: string): void => {
    sessionStorage.removeItem(key)
  }
}

// 创建一个计数器闭包
export const createCounter = (initialValue: number = 0) => {
  // 在闭包中保存的私有变量
  let count = initialValue;

  // 返回一个包含多个方法的对象
  return {
    // 获取当前计数
    getValue: () => count,
    
    // 增加计数
    increment: () => {
      count += 1;
      return count;
    },
    
    // 减少计数
    decrement: () => {
      count -= 1;
      return count;
    },
    
    // 重置计数
    reset: () => {
      count = initialValue;
      return count;
    }
  };
};

// 使用示例:
// const counter = createCounter(10);
// counter.increment(); // 11
// counter.increment(); // 12
// counter.decrement(); // 11
// counter.getValue(); // 11
// counter.reset(); // 10 
// 对象深度拷贝
export function deepClone(source) {
    // 判断复制的目标是数组还是对象
    const targetObj = source.constructor === Array ? [] : {}
    for (const keys in source) {
      if (source.hasOwnProperty(keys)) {
        if (source[keys] && typeof source[keys] === 'object') {
          // 如果值是对象，就递归一下
          targetObj[keys] = source[keys].constructor === Array ? [] : {}
          targetObj[keys] = deepClone(source[keys])
        } else {
          // 如果不是，就直接赋值
          targetObj[keys] = source[keys]
        }
      }
    }
    return targetObj
  }
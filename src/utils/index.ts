import { message } from 'antd';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export * from './storage'
// 扩展插件
dayjs.extend(utc);
dayjs.extend(timezone);

// biome-ignore lint/suspicious/noExplicitAny: allowed
export function objToParam<T = Record<string, any>>(params: T): string {
  return new URLSearchParams(params as unknown as Record<string, string>).toString()
}

export const getUserInfo = (): ApiType.User.Info | null => {
  const info = localStorage.getItem("info");
  return info ? JSON.parse(info) : null;
}

export const isAdmin = (): boolean => {
  const info = getUserInfo();
  return !!info?.is_root;
}


export const useClipboard = () => {
  const copyToClipboard = async (text: string) => {
    try {
      // 主方案：现代 Clipboard API
      await navigator.clipboard.writeText(text);
      message.success("复制成功");
      return true;
    } catch (err) {
      console.warn("复制失败:", err);
      // 降级方案：兼容旧浏览器
      return fallbackCopyText(text);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const success = document.execCommand("copy");
      if (success) {
        message.success("复制成功");
        return true;
      } else {
        message.error("复制失败，请手动复制");
        return false;
      }
    } catch (err) {
      console.error("降级复制失败:", err);
      message.error(`请手动复制: ${text}`);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  };

  return { copyToClipboard };
};

/**
 * 将时间转换为北京时间
 * @param date 日期时间
 * @param format 格式化模板
 * @returns 格式化后的北京时间字符串
 */
export const toBeijingTime = (date: string | number | Date | dayjs.Dayjs, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).tz("Asia/Shanghai").format(format);
};
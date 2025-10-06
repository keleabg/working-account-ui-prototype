import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * This utility merges Tailwind CSS classes intelligently, removing conflicts
 *
 * @param inputs - Class names to combine
 * @returns Merged class string
 *
 * @example
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a localized string
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date()) // "12/25/2023"
 * formatDate(new Date(), 'en-US', { dateStyle: 'full' }) // "Monday, December 25, 2023"
 */
export function formatDate(
  date: Date,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60)) // "1 hour ago"
 */
export function formatRelativeTime(
  date: Date,
  locale: string = "en-US",
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diff = date.getTime() - Date.now();
  const diffInSeconds = Math.floor(diff / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (Math.abs(diffInDays) > 0) {
    return rtf.format(diffInDays, "day");
  } else if (Math.abs(diffInHours) > 0) {
    return rtf.format(diffInHours, "hour");
  } else if (Math.abs(diffInMinutes) > 0) {
    return rtf.format(diffInMinutes, "minute");
  } else {
    return rtf.format(diffInSeconds, "second");
  }
}

/**
 * Truncates text to a specified length and adds ellipsis
 *
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 *
 * @example
 * truncateText("Hello world", 5) // "Hello..."
 * truncateText("Hello world", 5, " [more]") // "Hello [more]"
 */
export function truncateText(
  text: string,
  length: number,
  suffix: string = "...",
): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + suffix;
}

/**
 * Capitalizes the first letter of a string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 *
 * @example
 * capitalize("hello world") // "Hello world"
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to title case
 *
 * @param str - String to convert
 * @returns Title case string
 *
 * @example
 * toTitleCase("hello world") // "Hello World"
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

/**
 * Converts a string to kebab-case
 *
 * @param str - String to convert
 * @returns Kebab-case string
 *
 * @example
 * toKebabCase("Hello World") // "hello-world"
 * toKebabCase("helloWorld") // "hello-world"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Converts a string to camelCase
 *
 * @param str - String to convert
 * @returns CamelCase string
 *
 * @example
 * toCamelCase("hello-world") // "helloWorld"
 * toCamelCase("hello_world") // "helloWorld"
 */
export function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, char) => char?.toUpperCase() ?? "");
}

/**
 * Formats a number as currency
 *
 * @param amount - Number to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats a number with thousand separators
 *
 * @param num - Number to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Generates a random string of specified length
 *
 * @param length - Length of the string (default: 10)
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Random string
 *
 * @example
 * generateRandomString(8) // "aB3xY9mN"
 */
export function generateRandomString(
  length: number = 10,
  charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Debounces a function call
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 *
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function call
 *
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 *
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clones an object
 *
 * @param obj - Object to clone
 * @returns Deep cloned object
 *
 * @example
 * const cloned = deepClone({ a: { b: 1 } });
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 *
 * @param value - Value to check
 * @returns True if empty, false otherwise
 *
 * @example
 * isEmpty("") // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty(null) // true
 * isEmpty("hello") // false
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Sleeps for a specified number of milliseconds
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 *
 * @example
 * await sleep(1000); // Wait for 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

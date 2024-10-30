import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function extractColorCode(colorString: string) {
  const parts = colorString.split('#');
  return parts.length > 1 ? `#${parts[1]}` : null; // Trả về mã màu với dấu #
}
export function extractColorName(colorString: string) {
  const parts = colorString.split('#');
  return parts.length > 1 ? `${parts[0]}` : null; // Trả về mã màu với dấu #
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function truncateHash(hash: string, startLength = 6, endLength = 4) {
  if (!hash) return ''
  return `${hash.substring(0, startLength)}...${hash.substring(hash.length - endLength)}`
}


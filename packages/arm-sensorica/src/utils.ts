// arm-sensorica/src/utils.ts - Utility Functions
import { Hash, Timestamp, DualValue } from './types';

// ============================================
// ID GENERATION
// ============================================

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateULID(): string {
  // ULID-like: timestamp + random
  const timestamp = Date.now().toString(16).padStart(13, '0');
  const random = Math.random().toString(16).substr(2, 16);
  return timestamp + random;
}

// ============================================
// TIMESTAMP UTILITIES
// ============================================

export function now(): Timestamp {
  return { value: Date.now(), timezone: 'UTC' };
}

export function parseTimestamp(ts: Timestamp): Date {
  return new Date(ts.value);
}

export function formatTimestamp(ts: Timestamp, options?: Intl.DateTimeFormatOptions): string {
  return new Date(ts.value).toLocaleString(ts.timezone === 'UTC' ? 'en-US' : undefined, options);
}

export function isExpired(timestamp: Timestamp, ttlMs: number): boolean {
  return Date.now() > timestamp.value + ttlMs;
}

export function addDuration(ts: Timestamp, ms: number): Timestamp {
  return { value: ts.value + ms, timezone: ts.timezone };
}

// ============================================
// QUANTITY / DUAL VALUE UTILITIES
// ============================================

export function createQuantity(value: number | bigint, unit: string): { value: bigint; unit: string } {
  return { value: typeof value === 'number' ? BigInt(Math.round(value)) : value, unit };
}

export function addQuantities(a: { value: bigint; unit: string }, b: { value: bigint; unit: string }): { value: bigint; unit: string } {
  if (a.unit !== b.unit) throw new Error(`Cannot add quantities with different units: ${a.unit} + ${b.unit}`);
  return { value: a.value + b.value, unit: a.unit };
}

export function multiplyQuantity(q: { value: bigint; unit: string }, factor: number): { value: bigint; unit: string } {
  return { value: q.value * BigInt(Math.round(factor * 10000)) / 10000n, unit: q.unit };
}

export function compareQuantities(a: { value: bigint; unit: string }, b: { value: bigint; unit: string }): number {
  if (a.unit !== b.unit) throw new Error(`Cannot compare quantities with different units`);
  if (a.value > b.value) return 1;
  if (a.value < b.value) return -1;
  return 0;
}

export function formatDualValue(dv: DualValue, mode: 'postmonetario' | 'conectado', locale: string = 'en-US'): string {
  const amount = dv[mode];
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: mode === 'postmonetario' ? 'ZNU' : 'USD',
    minimumFractionDigits: mode === 'postmonetario' ? 0 : 2,
    maximumFractionDigits: mode === 'postmonetario' ? 0 : 2
  }).format(Number(amount) / (mode === 'postmonetario' ? 1 : 100));
}

export function addDualValues(a: DualValue, b: DualValue): DualValue {
  return {
    postmonetario: a.postmonetario + b.postmonetario,
    conectado: a.conectado + b.conectado
  };
}

export function subtractDualValues(a: DualValue, b: DualValue): DualValue {
  return {
    postmonetario: a.postmonetario - b.postmonetario,
    conectado: a.conectado - b.conectado
  };
}

export function multiplyDualValue(dv: DualValue, factor: number): DualValue {
  const factorBn = BigInt(Math.round(factor * 10000)) / 10000n;
  return {
    postmonetario: dv.postmonetario * BigInt(Math.round(factor * 10000)) / 10000n,
    conectado: dv.conectado * BigInt(Math.round(factor * 10000)) / 10000n
  };
}

export function isZeroDualValue(dv: DualValue): boolean {
  return dv.postmonetario === 0n && dv.conectado === 0n;
}

export function isPositiveDualValue(dv: DualValue): boolean {
  return dv.postmonetario > 0n || dv.conectado > 0n;
}

// ============================================
// HASH / CRYPTO UTILITIES
// ============================================

export function simpleHash(data: string | Uint8Array): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    hash = ((hash << 5) - hash) + byte;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export function hashString(str: string): string {
  return simpleHash(str);
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

// ============================================
// PERCENTAGE / RATE UTILITIES
// ============================================

export function calculatePercentage(amount: bigint, percentage: number): bigint {
  return (amount * BigInt(Math.round(percentage * 10000))) / 10000n;
}

export function calculateRate(numerator: bigint, denominator: bigint): number {
  if (denominator === 0n) return 0;
  return Number(numerator) / Number(denominator);
}

export function basisPointsToPercent(bps: number): number {
  return bps / 100;
}

export function percentToBasisPoints(percent: number): number {
  return Math.round(percent * 100);
}

// ============================================
// COLLECTION UTILITIES
// ============================================

export function groupBy<T, K>(array: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of array) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}

export function sortBy<T>(array: T[], keyFn: (item: T) => number | string, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aKey = keyFn(a);
    const bKey = keyFn(b);
    const comparison = aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
    return order === 'asc' ? comparison : -comparison;
  });
}

export function uniqueBy<T>(array: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidDID(did: string): boolean {
  return /^did:[a-z0-9]+:[a-zA-Z0-9._-]+$/.test(did);
}

export function isPositiveInteger(n: number): boolean {
  return Number.isInteger(n) && n > 0;
}

export function isPercentage(n: number): boolean {
  return typeof n === 'number' && n >= 0 && n <= 100;
}

export function isValidPercentage(n: number): n is number {
  return isPercentage(n);
}

// ============================================
// ASYNC UTILITIES
// ============================================

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}

export function retry<T>(
  fn: () => Promise<T>, 
  retries: number = 3, 
  delay: number = 1000,
  backoff: number = 2
): Promise<T> {
  return fn().catch(err => {
    if (retries <= 0) throw err;
    return sleep(delay).then(() => retry(fn, retries - 1, delay * backoff, backoff));
  });
}

export function parallelLimit<T>(
  items: T[],
  fn: (item: T) => Promise<any>,
  concurrency: number
): Promise<any[]> {
  const results: any[] = [];
  const executing: Promise<any>[] = [];
  
  for (const item of items) {
    const promise = fn(item).then(result => {
      results.push(result);
      return result;
    });
    executing.push(promise);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      // Remove completed
      const completedIdx = executing.findIndex(p => p === Promise.resolve());
      if (completedIdx !== -1) executing.splice(completedIdx, 1);
    }
  }
  
  return Promise.all(executing).then(() => results);
}

// ============================================
// ERROR HANDLING
// ============================================

export class SensoricaError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SensoricaError';
  }
}

export function isSensoricaError(err: unknown): err is SensoricaError {
  return err instanceof SensoricaError;
}

export function createError(code: string, message: string, details?: Record<string, unknown>): SensoricaError {
  return new SensoricaError(message, code, details);
}

// Common error codes
export const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INSUFFICIENT_TRUST: 'INSUFFICIENT_TRUST',
  QUORUM_NOT_MET: 'QUORUM_NOT_MET',
  PROPOSAL_EXPIRED: 'PROPOSAL_EXPIRED',
  RESOURCE_AT_CAPACITY: 'RESOURCE_AT_CAPACITY',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  CONSENSUS_FAILED: 'CONSENSUS_FAILED',
  ORACLE_UNAVAILABLE: 'ORACLE_UNAVAILABLE'
} as const;

// ============================================
// LOGGING
// ============================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

export class Logger {
  private level: LogLevel = 'info';
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const levels: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levels[level] < levels[this.level]) return;
    
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context
    };
    
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();
    
    // Console output
    const prefix = `[${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`, context || '');
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.logs];
    return this.logs.filter(l => l.level === level);
  }

  clear(): void {
    this.logs = [];
  }
}

export const logger = new Logger();

// ============================================
// ENVIRONMENT DETECTION
// ============================================

export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions?.node !== undefined;
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function isTestEnvironment(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
}
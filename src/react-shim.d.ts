declare module "react" {
  const React: any;
  export default React;
  export function useState<T>(
    initial: T | (() => T),
  ): [T, (value: any) => void];
  export function useEffect(effect: any, deps?: any[]): void;
  export function useRef<T = any>(initialValue?: T): { current: T };
  export function useCallback<T extends Function>(fn: T, deps?: any[]): T;
  export type FormEvent<T = any> = any;
  export type ReactNode = any;
}

declare module "react/jsx-runtime" {
  export const Fragment: any;
  export const jsx: any;
  export const jsxs: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

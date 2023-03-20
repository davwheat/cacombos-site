import { useCallback, useState } from 'react';

const debounce = (fn: any, delay: number) => {
  let timeout = -1;
  return (...args: any[]) => {
    if (timeout !== -1) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(fn, delay, ...args);
  };
};

export function useStateDebounced<T>(initialValue: T, delayMs: number): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [inputValue, _setInputValue] = useState<T>(initialValue);

  const [debouncedInputValue, setDebouncedInputValue] = useState<T>(initialValue);

  const memoizedDebounce = useCallback(
    debounce((value: T) => {
      setDebouncedInputValue(value);
    }, delayMs),
    [delayMs]
  );

  const setInputValue: React.Dispatch<React.SetStateAction<T>> = (value: T | ((prevState: T) => T)) => {
    if (value instanceof Function) {
      _setInputValue((p) => {
        const mutated = value(p);
        memoizedDebounce(mutated);
        return mutated;
      });
    } else {
      _setInputValue(value);
      memoizedDebounce(value);
    }
  };

  return [inputValue, debouncedInputValue, setInputValue];
}

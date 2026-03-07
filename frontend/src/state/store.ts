import { useSyncExternalStore } from 'react';

type Listener = () => void;

export class Store {
  private readonly listeners = new Set<Listener>();

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  protected notify(): void {
    this.listeners.forEach(listener => listener());
  }
}

export function useStoreSelector<TStore extends Store, TSelected>(
  store: TStore,
  selector: (store: TStore) => TSelected,
): TSelected {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store),
    () => selector(store),
  );
}

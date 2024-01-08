/* eslint-disable no-unused-vars */

type Callback<T = any> = (...args: T[]) => void;

class CustomEventBus {
  private events: Record<string, Callback[]> = {};

  $on<T>(eventName: string, callback: Callback<T>): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  $off(eventName: string, callback: Callback): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
    }
  }

  $emit<T>(eventName: string, ...args: T[]): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => cb(...args));
    }
  }
}

export default new CustomEventBus();
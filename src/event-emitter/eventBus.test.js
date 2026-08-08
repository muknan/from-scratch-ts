import { describe, expect, it, vi } from "vitest";
import { EventBus } from "./eventBus";

describe("EventBus", () => {
  it("creates an empty map", () => {
    const bus = new EventBus();

    expect(bus.events.size).toBe(0);
  });

  it("stores callback for an event", () => {
    const bus = new EventBus();

    function fn() {}

    bus.subscribe("login", fn);

    expect(bus.events.has("login")).toBe(true);
    expect(bus.events.get("login")).toEqual([fn]);
  });

  it("calls subscribed callbacks", () => {
    const bus = new EventBus();

    const cb = vi.fn();

    bus.subscribe("login", cb);

    bus.emit("login", { name: "Mukul" });

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith({ name: "Mukul" });
  });

  it("does not call unsubscribed callbacks", () => {
    const bus = new EventBus();
    const cb = vi.fn();

    bus.subscribe("login", cb);

    bus.unsubscribe("login", cb);

    bus.emit("login", { name: "Mukul" });

    expect(cb).not.toHaveBeenCalled();
  });

  it("remove only specified callback", () => {
    const bus = new EventBus();
    const first = vi.fn();
    const second = vi.fn();

    bus.subscribe("login", first);
    bus.subscribe("login", second);

    bus.unsubscribe("login", first);

    bus.emit("login", { name: "Mukul" });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("does nothing when removing unknown callback", () => {
    const bus = new EventBus();
    const first = vi.fn();
    const second = vi.fn();

    bus.subscribe("login", first);

    bus.unsubscribe("login", second);

    bus.emit("login");

    expect(first).toHaveBeenCalledTimes(1);
  });

  it("does nothing for unknown events (not subscribed)", () => {
    const bus = new EventBus();

    expect(() => {
      bus.emit("logout");
    }).not.toThrow();
  });

  it("does nothing when trying to unsubscribe unkown events", () => {
    const bus = new EventBus();

    const cb = vi.fn();

    bus.unsubscribe("logout", cb);

    expect(bus.events.size).toBe(0);
  });
});

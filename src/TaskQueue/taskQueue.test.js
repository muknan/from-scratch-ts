import { expect, it, describe, vi } from "vitest";
import TaskQueue from "./taskQueue";

describe("Testing Task Queue", () => {
  it("executes tasks in FIFO order", async () => {
    const queue = new TaskQueue();
    const order = [];

    const p1 = queue.enqueue(async () => {
      await Promise.resolve();
      order.push("A");
    });
    const p2 = queue.enqueue(async () => {
      await Promise.resolve();
      order.push("B");
    });
    const p3 = queue.enqueue(async () => {
      await Promise.resolve();
      order.push("C");
    });

    await Promise.all([p1, p2, p3]);

    expect(order).toEqual(["A", "B", "C"]);
  });

  it("returns the task result", async () => {
    const queue = new TaskQueue();

    const result = await queue.enqueue(async () => {
      return 42;
    });

    expect(result).toBe(42);
  });

  it("continue process after task fails", async () => {
    const queue = new TaskQueue();
    const order = [];

    const p1 = queue.enqueue(async () => {
      throw new Error("error");
    });
    const p2 = queue.enqueue(async () => {
      order.push("B");
    });
    const p3 = queue.enqueue(async () => {
      order.push("C");
    });

    const result = await Promise.allSettled([p1, p2, p3]);

    expect(result[0].status).toBe("rejected");
    expect(result[1].status).toBe("fulfilled");
    expect(result[2].status).toBe("fulfilled");

    expect(order).toEqual(["B", "C"]);
  });

  it("never exceed configured concurrency", async () => {
    const queue = new TaskQueue({ concurrency: 2 });

    let running = 0;

    let resolveA;
    let resolveB;

    const taskA = () => {
      running++;

      return new Promise((resolve) => {
        resolveA = () => {
          running--;
          resolve();
        };
      });
    };

    const taskB = () => {
      running++;

      return new Promise((resolve) => {
        resolveB = () => {
          running--;
          resolve();
        };
      });
    };

    queue.enqueue(taskA);
    queue.enqueue(taskB);

    expect(running).toBe(2);

    resolveA();
    resolveB();

    expect(running).toBe(0);
  });

  it("queue task when concurrency is full", () => {
    const queue = new TaskQueue({ concurrency: 2 });
    let running = 0;

    let resolveA;

    const createTask = (setResolver) => {
      return () => {
        running++;

        return new Promise((resolve) => {
          setResolver(() => {
            running--;
            resolve();
          });
        });
      };
    };

    const taskA = createTask((fn) => (resolveA = fn));
    const taskB = createTask(() => {});
    const taskC = createTask(() => {});

    queue.enqueue(taskA);
    queue.enqueue(taskB);
    queue.enqueue(taskC);

    expect(running).toBe(2);

    resolveA();
  });

  it("start next queued task when slot is available", async () => {
    const queue = new TaskQueue({ concurrency: 2 });
    let running = 0;
    const started = [];

    let resolveA;

    const createTask = (name, setResolver) => {
      return () => {
        running++;
        started.push(name);

        return new Promise((resolve) => {
          setResolver(() => {
            running--;
            resolve();
          });
        });
      };
    };

    const taskA = createTask("A", (fn) => {
      resolveA = fn;
    });

    const taskB = createTask("B", () => {});

    const taskC = createTask("C", () => {});

    queue.enqueue(taskA);
    queue.enqueue(taskB);
    queue.enqueue(taskC);

    expect(started).toEqual(["A", "B"]);

    resolveA();

    await vi.waitFor(() => {
      expect(started).toEqual(["A", "B", "C"]);
    });

    expect(running).toBe(2);
  });
});

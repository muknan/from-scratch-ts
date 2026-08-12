export default class TaskQueue {
  constructor({ concurrency = 1 } = {}) {
    this.queue = [];
    this.concurrency = concurrency;
    this.running = 0;
    this.deadLetters = [];
  }

  enqueue(task, options) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,

        maxRetries: options?.maxRetries ?? 0,
        baseDelay: options?.baseDelay ?? 1000,
        retries: 0,
      });
      this.processQueue();
    });
  }

  processQueue() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const item = this.queue.shift();
      this.running++;

      Promise.resolve()
        .then(() => item.task())
        .then((e) => item.resolve(e))
        .catch((e) => {
          item.retries++;
          if (item.retries > item.maxRetries) {
            this.deadLetters.push({
              task: item.task,
              error: e,
              maxRetries: item.maxRetries,
              retries: item.retries,
            });
            item.reject(e);
            return;
          }
          const delay = item.baseDelay * 2 ** (item.retries - 1);
          setTimeout(() => {
            this.queue.push(item);
            this.processQueue();
          }, delay);
        })
        .finally(() => {
          this.running--;
          this.processQueue();
        });
    }
  }

  // async processNext() {
  //   if (this.queue.length === 0) return;
  //   if (this.running >= this.concurrency) return;

  //   const item = this.queue.shift();

  //   try {
  //     this.running++;
  //     const res = await item.task();
  //     item.resolve(res);
  //   } catch (error) {
  //     item.reject(error);
  //   } finally {
  //     this.running--;
  //     while (this.running < this.concurrency && this.queue.length > 0) {
  //       this.processNext();
  //     }
  //   }
  // }
}

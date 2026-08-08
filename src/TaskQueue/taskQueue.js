export default class TaskQueue {
  constructor({ concurrency = 1 } = {}) {
    this.queue = [];
    this.concurrency = concurrency;
    this.running = 0;
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
      });
      this.processQueue();
    });
  }

  processQueue() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const item = this.queue.shift();
      this.running++;

      item
        .task()
        .then((e) => item.resolve(e))
        .catch((e) => item.reject(e))
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

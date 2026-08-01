export class EventBus {
  constructor() {
    this.events = new Map();
  }

  subscribe(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  emit(event, data) {
    if (!this.events.has(event)) return;
    const listeners = this.events.get(event);

    for (const cb of listeners) {
      cb(data);
    }
  }

  unsubscribe(event, cb) {
    if (!this.events.has(event)) return;

    const updated = this.events.get(event).filter((fn) => fn !== cb);

    if (updated.length === 0) this.events.delete(event);
    else this.events.set(event, updated);
  }
}

function fn1(user) {
  console.log("Navbar: ", user.name);
}

function fn2(user) {
  console.log("Toast: ", user.name);
}

const bus = new EventBus();

bus.subscribe("login", fn1);
bus.subscribe("login", fn2);

bus.emit("login", { name: "Mukul" });

bus.unsubscribe("login", fn2);

console.log(bus);

bus.emit("login", { name: "Mukul" });

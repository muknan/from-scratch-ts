import { useEffect } from "react";
import bus from "./eventBus";

export default function useEventBus(event, callback) {
  useEffect(() => {
    return bus.subscribe(event, callback);
  }, [event, callback]);
}

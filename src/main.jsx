import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import UseDebounceApp from "./debounce/useDebounce.jsx";
// import UseThrottleApp from "./throttle/useThrottle.jsx";
import UseMemoizeApp from "./memoize/useMemoize.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UseMemoizeApp />
  </StrictMode>,
);

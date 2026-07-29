import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import UseDebounceApp from "./debounce/useDebounce.jsx";
import UseThrottleApp from "./throttle/useThrottle.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UseThrottleApp />
  </StrictMode>,
);

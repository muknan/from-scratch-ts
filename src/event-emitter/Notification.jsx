import { useState } from "react";
import useEventBus from "./useEventBus";

export default function Notification() {
  const [user, setUserName] = useState(null);
  const handleLogin = (user) => setUserName(user);
  const alertUser = () => {
    if (!user) return;
    alert(`Welcome ${user.name}`);
  };

  useEventBus("login", handleLogin);

  return <div>{user && <button onClick={alertUser}>Notify</button>}</div>;
}

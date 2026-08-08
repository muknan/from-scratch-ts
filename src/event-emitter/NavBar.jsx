import { useState } from "react";
import useEventBus from "./useEventBus";

export default function NavBar() {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => setUser(user);

  useEventBus("login", handleLogin);

  return <nav>{user ? `Welcome ${user.name}` : "Not logged in"}</nav>;
}

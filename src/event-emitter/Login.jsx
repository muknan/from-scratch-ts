import bus from "./eventBus";

export default function LoginButton() {
  function login() {
    bus.emit("login", { name: "Mukul" });
  }

  return <button onClick={login}>Login</button>;
}

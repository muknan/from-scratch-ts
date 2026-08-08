import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounceValue;
}

export default function UseDebounceApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const useDebounceTerm = useDebounce(searchTerm, 1000);

  return (
    <div>
      <input
        type="text"
        placeholder="Type your input..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      ></input>
      <h2>{useDebounceTerm}</h2>
    </div>
  );
}

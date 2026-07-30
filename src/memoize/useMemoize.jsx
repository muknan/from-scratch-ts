import { useMemo, useState } from "react";
import React from "react";

export default function UseMemoizeApp() {
  const [inputValue, setInputValue] = useState(1);
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Memoization Examples</h1>
      <label>
        Enter number:
        <input
          type="text"
          placeholder="Enter a number..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </label>
      <h2>Without Memoization:</h2>
      <WithoutMemoization value={inputValue} />
      <h2>Memoization with useMemo hook:</h2>
      <MemoizeHook value={inputValue} />
      <h2>Memoization with React.memo():</h2>
      <MemoizeComponent value={inputValue} />

      <button onClick={() => setCount(count + 1)}>
        Re-render Parent ({count})
      </button>
    </div>
  );
}

const compute = (value) => {
  let res = 0;
  for (let i = 0; i < value; i++) {
    res += Math.random();
  }
  return Math.ceil(res);
};

const WithoutMemoization = ({ value }) => {
  const val = compute(value);

  return (
    <div>
      <p>Result: {val}</p>
    </div>
  );
};

const MemoizeHook = ({ value }) => {
  const val = useMemo(() => compute(value), [value]);

  return (
    <div>
      <p>Result: {val}</p>
    </div>
  );
};

const MemoizeComponent = React.memo(({ value }) => {
  const val = compute(value);

  return (
    <div>
      <p>Result: {val}</p>
    </div>
  );
});

import { useState, useRef } from "react";
import "./App.css";
import { produce } from "immer";

const rows = 50;
const columns = 50;

function App() {
  //init the function in the usestate so it'll run only once upon app loading
  const [grid, setGrid] = useState(() => {
    const _rows = [];
    for (let i = 0; i < rows; i++) {
      //push an array from a array of columns containing zero in the initial state
      _rows.push(Array.from(Array(columns), () => 0));
    }
    return _rows;
  });
  const [start, setStart] = useState(false);
  //to have this function not called everytime the components rerender, we use the callback function
  //but also because when start changes, the runStart function wouldnt update, we can use ref.
  const startRef = useRef(start);
  startRef.current = start;

  const runStart = useCallback(() => {
    if (!start) return;
    setTimeout(runStart, 1000);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setStart(!start);
        }}
      >
        {start ? "Stop" : "Start"}
      </button>
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((columns, k) => (
            <div
              key={`${i - k}`}
              onClick={() => {
                const newGrid = produce(grid, (copy) => {
                  copy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "solid 1px black",
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default App;

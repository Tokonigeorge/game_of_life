import { useState, useRef, useCallback } from "react";
import "./App.css";
import { produce } from "immer";
import { useMediaQuery } from "./MatchMedia";

const rows = 50;
const columns = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const emptyGrid = () => {
  const _rows = [];
  for (let i = 0; i < rows; i++) {
    //push an array from a array of columns containing zero in the initial state
    _rows.push(Array.from(Array(columns), () => 0));
  }
  return _rows;
};

function App() {
  //init the function in the usestate so it'll run only once upon app loading
  const [grid, setGrid] = useState(() => {
    // return emptyGrid();
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
    if (!startRef.current) {
      return;
    }
    setGrid((grid) => {
      return produce(grid, (copy) => {
        for (let i = 0; i < rows; i++) {
          for (let k = 0; k < columns; k++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < rows && newK >= 0 && newK < columns) {
                neighbours += grid[newI][newK];
              }
            });
            if (neighbours < 2 || neighbours > 3) {
              copy[i][k] = 0;
            } else if (grid[i][k] === 0 && neighbours === 3) {
              copy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runStart, 100);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setStart(!start);

          if (!start) {
            startRef.current = true;
            runStart();
          }
        }}
      >
        {start ? "Stop" : "Start"}
      </button>
      <button
        onClick={() => {
          setGrid(emptyGrid());
        }}
      >
        Clear
      </button>
      <div style={{ margin: "auto", width: "90vw" }}>
        <div
          className="App"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 20px)`,
          }}
        >
          {Array.isArray(grid)
            ? grid.map((rows, i) =>
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
                      backgroundColor: grid[i][k] ? "black" : undefined,
                      border: "solid 1px grey",
                    }}
                  ></div>
                ))
              )
            : null}
        </div>
      </div>
    </>
  );
}

export default App;

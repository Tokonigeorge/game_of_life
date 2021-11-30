import { useState, useRef, useCallback } from "react";
import "./App.css";
import { produce } from "immer";
import Button from "./components/Button";

const rows = Math.round(
  (window.innerHeight > 790 ? columns : window.innerHeight - 100) / 20
);
const columns = Math.round(
  (window.innerWidth > 790 ? 790 : window.innerWidth - 70) / 20
);

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
    return emptyGrid();
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

  const handleToggleStart = () => {
    setStart(!start);

    if (!start) {
      startRef.current = true;
      runStart();
    }
  };

  const handleEmptyGrid = () => {
    setGrid(emptyGrid());
  };

  const handleRandomState = () => {
    const _rows = [];
    for (let i = 0; i < rows; i++) {
      _rows.push(
        Array.from(Array(columns), () => (Math.random() > 0.7 ? 1 : 0))
      );
    }

    setGrid(_rows);
  };

  return (
    <>
      <div
        className="App"
        style={{
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10vh",
            left: "0",
            margin: "auto",
            width: "40vw",
            backgroundColor: "black",
            minHeight: "80vh",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "5vh",
          }}
        >
          <div
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
                        backgroundColor: grid[i][k] ? "#353535" : "#D2D7DF",
                        border: "solid 1px grey",
                      }}
                    ></div>
                  ))
                )
              : null}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1em 0",
            flexWrap: "wrap",
          }}
        >
          <Button
            text={start ? "Stop" : "Start"}
            handleClick={handleToggleStart}
            marginRight="10px"
            play={!start}
            pause={start}
          />
          <Button
            text={"Clear"}
            handleClick={handleEmptyGrid}
            marginRight="10px"
            clear={true}
          />
          <Button
            text={"Random"}
            handleClick={handleRandomState}
            marginRight="10px"
            random={true}
          />
          <Button text={"Explanation"} handleClick={() => {}} details={true} />
        </div>
      </div>
    </>
  );
}

export default App;

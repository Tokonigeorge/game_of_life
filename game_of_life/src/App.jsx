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

  const [open, setOpen] = useState(false);

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

  const handleToggleModal = () => {
    setOpen(!open);
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
        {open && (
          <div
            style={{
              position: "absolute",
              top: "20vh",
              left: window.innerWidth > 790 ? "30vw" : "15vw",
              width: window.innerWidth > 790 ? "40vw" : "70vw",
              backgroundColor: "white",
              height: "60vh",
              border: "1px solid white",
              borderRadius: "5px",
              overflowY: "scroll",
              overflowX: "hidden",
              color: "#353535",
            }}
          >
            <div
              style={{
                marginLeft: window.innerWidth > 790 ? "90%" : "85%",
                marginTop: "1em",
                cursor: "pointer",
              }}
              onClick={handleToggleModal}
            >
              <ClearIcon />
            </div>
            <div
              style={{
                padding: window.innerWidth > 790 ? "0 2em" : "0 1em",
                marginTop: "-2em",
              }}
            >
              <h2>John Conway's game of Life</h2>
              <p>
                The Game of Life is not your typical computer game. It is a
                cellular automaton, and was invented by Cambridge mathematician
                John Conway.
              </p>
              <p>
                This game became widely known when it was mentioned in an
                article published by Scientific American in 1970. It consists of
                a collection of cells which, based on a few mathematical rules,
                can live, die or multiply. Depending on the initial conditions,
                the cells form various patterns throughout the course of the
                game.
              </p>
              <h4>Rules</h4>
              <p style={{ marginTop: "-0.5em" }}>
                For a space that is populated:
              </p>
              <p>Each cell with one or no neighbors dies, as if by solitude.</p>
              <p>
                Each cell with four or more neighbors dies, as if by
                overpopulation.
              </p>
              <p>Each cell with two or three neighbors survives.</p>
              <p>For a space that is empty or unpopulated:</p>
              <p>Each cell with three neighbours becomes populated</p>
              <h4>The Controls</h4>
              <p style={{ marginTop: "-0.5em" }}>
                Make a pattern by clicking on the cells. The 'Start' button
                advances the game by several generations (each new generation
                corresponding to one iteration of the rules).
              </p>
            </div>
          </div>
        )}
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
          <Button
            text={"Explanation"}
            handleClick={handleToggleModal}
            details={true}
          />
        </div>
      </div>
    </>
  );
}

export default App;

const ClearIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      fillRule="#353535"
      viewBox="0 0 48 48"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
};

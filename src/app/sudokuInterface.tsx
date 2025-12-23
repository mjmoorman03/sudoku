"use client";

import { useState, useEffect, useMemo } from "react";
import SudokuGrid from "./sudokuGrid";
import Button from "./button";
import ZoomButton from "./zoomButton";
import Controls from "./controls";
import easyPuzzles from "../data/easyPuzzles.json";
import mediumPuzzles from "../data/mediumPuzzles.json";
import hardPuzzles from "../data/hardPuzzles.json";
import { GridObject } from "./interfaces";
import Confetti from "react-confetti";
import useWindowDimensions from "./useWindowDims";
import { Box } from "@mui/material";
import { useTimer } from "./hooks/timer";

const initialGrid = [
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
];

const annotationsGrid: string[][][] = [
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
];

export default function SudokuInterface() {
  const [checkStatus, setCheckStatus] = useState<
    "valid" | "invalid" | "unchecked"
  >("unchecked");
  const [visible, setVisible] = useState(false);
  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null);
  const [panelStatus, setPanelStatus] = useState<
    "annotations" | "ordinary" | "colors"
  >("ordinary");
  const [gridObj, setGridObj] = useState<GridObject>({
    grid: initialGrid,
    default: initialGrid,
    color: initialGrid,
    annotations: annotationsGrid,
    solution: initialGrid,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { width, height } = useWindowDimensions();
  // set zoomlevel to 1.0 if width > 600 else 0.7

  const { timerComp, resetTimer, pauseTimer } = useTimer();

  const numCounts = useMemo(() => {
    return gridObj.grid.reduce(
      (acc, arr) => {
        const tmpCounts = arr.reduce((tmpAcc, num) => {
          tmpAcc[num] = tmpAcc[num] + 1;
          return tmpAcc;
        }, acc);
        return tmpCounts;
      },
      {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
      } as Record<string, number>
    );
  }, [gridObj.grid]);

  useEffect(() => {
    const initialZoom = window.innerWidth < 650 ? 0.7 : 1;
    setZoomLevel(initialZoom);
  }, []);

  useEffect(() => {
    if (checkStatus === "unchecked") {
      const t = requestAnimationFrame(() => setVisible(false));
      return;
    }
    // reset to hidden, then show on the next frame so transition runs
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    // hide again after 3 seconds
    const hideTimeout = setTimeout(() => {
      setCheckStatus("unchecked");
    }, 3000);
    return () => {
      cancelAnimationFrame(t);
      clearTimeout(hideTimeout);
    };
  }, [checkStatus]);

  useEffect(() => {
    // reset zoom level when panel changes
    if (isGridComplete(gridObj.grid, gridObj.solution)) {
      setIsComplete(true);
      setShowConfetti(true);
      pauseTimer();
      setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
    }
  }, [gridObj.grid, gridObj.solution, pauseTimer]);

  function handleCellChange(row: number, col: number, value: string) {
    // set new color grid value
    if (
      panelStatus === "colors" &&
      [
        "Khaki",
        "DarkSeaGreen",
        "LightSkyBlue",
        "PeachPuff",
        "Plum",
        "LightGreen",
        "LightSalmon",
        "LightSteelBlue",
        "LightCoral",
        "",
      ].includes(value)
    ) {
      setGridObj((prevGrid: GridObject) => {
        const newColorGird = prevGrid.color.map((r: string[], i: number) => {
          if (i === row) {
            return r.map((v: string, j: number) => {
              if (j === col) {
                if (v === value || value === "") {
                  return ""; // toggle off
                }
                return value; // set to new color
              } else {
                return v;
              }
            });
          } else {
            return r;
          }
        });
        return { ...gridObj, color: newColorGird };
      });
      return;
    }
    if (gridObj.default[row][col] !== "") {
      // don't allow changes to default grid cells
      return;
    }
    if (panelStatus === "annotations") {
      if (value === "" && gridObj.annotations[row][col].length === 0) {
        setGridObj((prevGrid: GridObject) => {
          const newGrid = prevGrid.grid.map((r: string[], i: number) =>
            i === row ? r.map((v, j) => (j === col ? "" : v)) : r
          );
          return { ...gridObj, grid: newGrid };
        });
        return;
      }
      if (gridObj.grid[row][col] !== "") {
        return;
      }
      // toggle annotation
      setGridObj((prevGrid: GridObject) => {
        if (value === "") {
          // remove annotation
          const newAnnotations = prevGrid.annotations.map(
            (r: string[][], i: number) =>
              i === row ? r.map((v, j) => (j === col ? [] : v)) : r
          );
          return { ...gridObj, annotations: newAnnotations };
        }
        const newAnnotations = prevGrid.annotations.map(
          (r: string[][], i: number) => {
            if (i === row) {
              return r.map((v, j) => {
                if (j === col) {
                  if (v.includes(value)) {
                    return v.filter((ann) => ann !== value); // remove annotation
                  } else {
                    return [...v, value]; // add annotation
                  }
                } else {
                  return v;
                }
              });
            } else {
              return r;
            }
          }
        );
        return { ...gridObj, annotations: newAnnotations };
      });
      return;
    }
    const newGrid = gridObj.grid.map((r: string[], i: number) => {
      if (i === row) {
        return r.map((v: string, j: number) => {
          if (j === col) {
            if (v === value) {
              return ""; // toggle off
            }
            return value; // set to new value
          } else {
            return v;
          }
        });
      } else {
        return r;
      }
    });
    // clear annotations for that cell
    const newAnnotations = gridObj.annotations.map((r: string[][], i: number) =>
      i === row ? r.map((v, j) => (j === col ? [] : v)) : r
    );
    setGridObj({ ...gridObj, grid: newGrid, annotations: newAnnotations });
  }

  function handleZoomIn() {
    setZoomLevel((zl: number) => Math.min(3.0, zl + 0.1));
  }

  function handleZoomOut() {
    setZoomLevel((zl: number) => Math.max(0.5, zl - 0.1));
  }

  function handleArrowKey(row: number, col: number, direction: string) {
    let newRow = row;
    let newCol = col;

    switch (direction) {
      case "ArrowUp":
        newRow = Math.max(0, row - 1);
        break;
      case "ArrowDown":
        newRow = Math.min(8, row + 1);
        break;
      case "ArrowLeft":
        newCol = Math.max(0, col - 1);
        break;
      case "ArrowRight":
        newCol = Math.min(8, col + 1);
        break;
    }

    setFocusedCell([newRow, newCol]);
  }

  function handleCellFocus(row: number, col: number) {
    setFocusedCell([row, col]);
  }

  function handleCheckGrid() {
    // check grid to solution
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (gridObj.grid[i][j] !== "") {
          if (gridObj.grid[i][j] !== gridObj.solution[i][j]) {
            setCheckStatus("invalid");
            return;
          }
        }
      }
    }
    setCheckStatus("valid");
  }

  function isGridComplete(grid: string[][], sol: string[][]) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== sol[i][j]) {
          return false;
        }
      }
    }
    if (grid[0][0] === "") {
      return false; // to prevent first mount
    }
    return true;
  }

  function handleNewPuzzle(e: React.MouseEvent<HTMLButtonElement>) {
    const difficulty = e.currentTarget?.textContent?.toLowerCase();
    const puzzles =
      difficulty === "easy"
        ? easyPuzzles
        : difficulty === "medium"
        ? mediumPuzzles
        : difficulty === "hard"
        ? hardPuzzles
        : easyPuzzles;
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    // convert to 2D array
    const newGrid: string[][] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = randomPuzzle["puzzle"][i * 9 + j];
        if (newGrid[i] === undefined) {
          newGrid[i] = [];
        }
        newGrid[i][j] = val === "0" ? "" : val;
      }
    }
    const solution: string[][] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = randomPuzzle["solution"][i * 9 + j];
        if (solution[i] === undefined) {
          solution[i] = [];
        }
        solution[i][j] = val === "0" ? "" : val;
      }
    }
    setGridObj({
      grid: newGrid,
      default: newGrid,
      color: initialGrid,
      annotations: annotationsGrid,
      solution: solution,
    });
    setCheckStatus("unchecked");
    resetTimer();
  }

  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button label="Easy" onClick={handleNewPuzzle} />
          <Button label="Medium" onClick={handleNewPuzzle} />
          <Button label="Hard" onClick={handleNewPuzzle} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            width: "100%",
            transform: `translateX(-${17}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <ZoomButton label="+" onClick={handleZoomIn} />
            <ZoomButton label="-" onClick={handleZoomOut} />
          </div>
          <div style={{ justifySelf: "center" }}>
            <SudokuGrid
              gridObj={gridObj}
              handleCellChange={handleCellChange}
              handleArrowKey={handleArrowKey}
              handleCellFocus={handleCellFocus}
              focusedCell={focusedCell}
              zoomLevel={zoomLevel}
            />
          </div>
          <div />
        </div>
        <Button label="Check Solution" onClick={handleCheckGrid} />
        {checkStatus !== "unchecked" && (
          <h3
            style={
              checkStatus === "valid"
                ? { ...statusValidStyle, opacity: visible ? 1 : 0 }
                : { ...statusInvalidStyle, opacity: visible ? 1 : 0 }
            }
          >
            {checkStatus === "invalid"
              ? "There are errors in your solution."
              : isComplete
              ? "Congratulations! You solved the puzzle!"
              : "No errors found! Keep it up!"}
          </h3>
        )}
      </div>
      <Box display="flex" flexDirection="column" alignItems="center">
        {timerComp}
        <Controls
          focusedCell={focusedCell}
          handleCellChange={handleCellChange}
          panelStatus={panelStatus}
          changePanel={setPanelStatus}
          numCounts={numCounts}
        />
      </Box>
      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={200} />
      )}
    </div>
  );
}

const statusValidStyle: React.CSSProperties = {
  height: "30px",
  marginBottom: "10px",
  fontSize: "18px",
  lineHeight: "0px",
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: "#4CAF50",
  color: "white",
  borderRadius: "5px",
  padding: "20px",
  border: "1px solid green",
  transition: "opacity 1s ease-in-out",
};

const statusInvalidStyle: React.CSSProperties = {
  height: "30px",
  lineHeight: "0px",
  marginBottom: "10px",
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: "#ffcccc",
  color: "red",
  border: "1px solid red",
  borderRadius: "8px",
  padding: "20px",
  transition: "opacity 1s ease-in-out",
};

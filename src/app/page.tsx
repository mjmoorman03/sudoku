import SudokuInterface from "./sudokuInterface";
import { Footer, FooterCopyright } from "flowbite-react";

export default function Home() {
  return (
    <>
      <div className="mainDiv">
        <SudokuInterface />
      </div>
      <Footer container>
        <FooterCopyright
          href="https://www.linkedin.com/in/michael-moorman-01547b205/"
          by="Michael Moorman"
          year={2025}
        />
        <a
          href="https://www.flaticon.com/free-icons/sudoku"
          style={{ color: "gray" }}
          title="sudoku icons"
        >
          Sudoku icons created by Freepik - Flaticon
        </a>
      </Footer>
    </>
  );
}

import SudokuInterface from "./sudokuInterface";


export default function Home() {

  return (
    <div className='mainDiv'>
      <SudokuInterface />
    </div>
  )
}

// need to lift state up to implement checker
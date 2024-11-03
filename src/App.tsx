import './App.css'
import SudokuSolver from './components/SudokuSolver'

function App() {

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <SudokuSolver />
      </div>
    </main>
  )
}

export default App

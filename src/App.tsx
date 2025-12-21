import './App.css'
// component
import ChangeThemeButton from './Components/ChangeThemeButton/ChangeThemeButton'
import { ThemeProvider } from './context/ThemeContext'
import GameWrapper from './Components/GameWrapper/GameWrapper'


function App() {

  return (
    <>
    <ThemeProvider>
      <ChangeThemeButton/>
      <GameWrapper/>
    </ThemeProvider>
    </>
  )
}

export default App
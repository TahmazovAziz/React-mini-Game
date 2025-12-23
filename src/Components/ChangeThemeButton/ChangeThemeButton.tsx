import { useContext } from "react"
import { ThemeContext } from "../../context/ThemeContext"
import lightPath from '../../assets/images/light-mode.webp';
import darkPath from '../../assets/images/dark-mode.webp';
import './ChangeThemeButton.css'
export default function ChangeThemeButton(){
    const {theme, toggle} = useContext(ThemeContext)
    return(
        <button  onClick={toggle} className="change-theme"><img src={theme == 'light' ? lightPath : darkPath} alt="" /></button>
    )
}
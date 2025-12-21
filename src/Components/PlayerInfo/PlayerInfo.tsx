import { useContext } from 'react';
import './PlayerInfo.css';
import { ThemeContext } from '../../context/ThemeContext';
interface PlayerInfoProps {
    money: number;
    health: number;
    food: number;
}
export default function PlayerInfo({money, health, food} : PlayerInfoProps) {
    const {theme} = useContext(ThemeContext)
    return(
        <>
            <div className={`player-info ${theme}`}>
                <p className={`health ${theme}`}>❤ health: {health}</p>
                <p className={`money ${theme}`}>💸 money: {money}</p>
                <p className={`food ${theme}`}>🍗 food: {food}</p>
            </div>
        </>
    );
}
import './PlayerInfo.css';
interface PlayerInfoProps {
    money: number;
    health: number;
    food: number;
}
export default function PlayerInfo({money, health, food} : PlayerInfoProps) {
    return(
        <>
            <div className="player-info">
                <p className='health'>❤ health: {health}</p>
                <p className='money'>💸 money: {money}</p>
                <p className='food'>🍗 food: {food}</p>
            </div>
        </>
    );
}
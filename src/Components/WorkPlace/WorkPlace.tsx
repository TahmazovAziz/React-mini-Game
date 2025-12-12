import { useRef, useState } from "react";
import useSound from "../../hooks/useSound";
import OfficeSoundPath from '../../assets/sounds/sound_office.mp3'
interface WorkPlaceProps {
    view:boolean;
}



export default function WorkPlace({view}: WorkPlaceProps) {
    const [top, setTop] = useState(0)
    const [word, setWord] = useState<number[]>([])
    const [callCount, setCallCount] = useState(0)
    const [viewInstr, setViewInstr] = useState(true)
    const [plusBuild, setPlusBuild] = useState(false)
    const OfficeSound = useRef<HTMLAudioElement>(null)
    const {playSound, stopSound} = useSound({soundRef: OfficeSound})
    const wordStyle:React.CSSProperties = {
        width:"120px",
        height:"120px",
        backgroundSize: '100% 100%',
        position: "absolute",
        left: "40%",
        userSelect:"none",
        textAlign:"center"

        
    }
    const containerStyle:React.CSSProperties = {
        width:"100%",
        maxWidth: '300px',
        height: '100px',
        borderRadius: '10px',
        background:'transparate',
        position: 'absolute',
        left: '49%',
        top: '48%',
        transform: 'translate(-50%, -50%)',
        margin:"0 auto",
        userSelect:"none",

        zIndex: view ? 1 : -1,
    }
    const pStyle:React.CSSProperties = {
        fontSize: "40px",
        textTransform: "uppercase",
        display:viewInstr ? "block" : "none",
        textAlign:"center",
        position: 'absolute',
        userSelect:"none",

        

    }
    const AddComp = () => {
        setViewInstr(false)
        playSound()
        setCallCount(prev => {
            const newCount = prev + 1
            if(newCount === 10){
                setTop(e=> e + 11)
                word.push(top)
                if(word.length >= 10){
                    setWord([])
                    setTop(0)
                }
                return 0
            }
            else{
                setPlusBuild(true)
                setTimeout(() => {setPlusBuild(false)}, 500)
                return newCount
            }
        })
    }

    return (
        <div className="container" style={containerStyle} onClick={AddComp}>
            <p style={pStyle}>Click for build</p>
            {word.map((item, index)=>(
                <div key={index}  style={{ ...wordStyle, top: `${item}%` }}> -------------------------------</div>
            ))}
            <audio ref={OfficeSound} src={OfficeSoundPath}></audio>
            {plusBuild && <p style={{...pStyle }}>🔨+1</p>}
        </div>
    )
}
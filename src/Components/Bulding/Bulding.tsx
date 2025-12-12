import { useRef, useState } from "react"
import BuildSoundPath from '../../assets/sounds/build.mp3'
import useSound from "../../hooks/useSound";

interface BuldingProps{
    containerWidth:number;
    containerHeight:number;
    viewBuild:boolean
}

export default function Bulding({containerWidth,containerHeight, viewBuild}:BuldingProps){
    const [top, setTop] = useState(74)
    const [home, setHome] = useState<number[]>([])
    const [callCount, setCallCount] = useState(0)
    const [viewInstr, setViewInstr] = useState(true)
    const [plusBuild, setPlusBuild] = useState(false)
    const buildSound = useRef<HTMLAudioElement>(null)
    const {playSound, stopSound} = useSound({soundRef: buildSound})
    const [backImage,setBackImage] = useState('../../src/assets/images/build.png')
    const Cont:React.CSSProperties = {
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        border: '2px solid black',
        backgroundImage: `url(${backImage})`,    
        backgroundSize: 'cover',
        position:"relative",
        borderRadius: '10px',
        margin:"0 auto",
        display: viewBuild ? 'block' : 'none'
    }
    
    const homeStyle:React.CSSProperties = {
        width:"120px",
        height:"120px",
        backgroundImage: "url('../../src/assets/images/apartament.png')",
        backgroundSize: '100% 100%',
        position: "absolute",
        left: "40%"
    }
    const pStyle:React.CSSProperties = {
        fontSize: "40px",
        textTransform: "uppercase",
        display:viewInstr ? "block" : "none",
    }
    
    const pregressStyle:React.CSSProperties = {
        display:"block",
        position:"absolute", 
        right:"50px",
        bottom:"70px",
        userSelect:"none",
        color:"orange"

    }
    
    const AddComp = () => {
        setViewInstr(false)
        playSound()
        setCallCount(prev => {
            const newCount = prev + 1
            if(newCount === 5){
                setTop(e=> e - 11)
                home.push(top)
                if(home.length >= 10){
                    setBackImage('../../src/assets/images/sky.jpeg')
                    setHome([])
                    setTop(77)
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
    return(
        <div className="container" style={Cont} onClick={AddComp}>
            <p style={pStyle}>Click for build</p>
            {home.map((item, index)=>(
                <div key={index} className="home"  style={{ ...homeStyle, top: `${item}%` }}></div>
            ))}
            <audio ref={buildSound} src={BuildSoundPath}></audio>
            {plusBuild && <p style={{...pStyle, ...pregressStyle }}>🔨+1</p>}
        </div>
    )

}
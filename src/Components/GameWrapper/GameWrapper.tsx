import Bulding from "../Bulding/Bulding";
import Button from "../Button/Button";
import ImagePlace from "../ImagePlace/ImagePlace";
import LocationButtons from "../LocationButtons/LocationButtons";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import WorkPlace from "../WorkPlace/WorkPlace";
// audio
import streetSoundPath from '../../assets/sounds/street.mp3'
import homeSoundPath from '../../assets/sounds/home.mp3'
import storeSoundPath from '../../assets/sounds/store.mp3'
import eatSoundPath from '../../assets/sounds/eat.mp3'
import sleepSoundPath from '../../assets/sounds/sleep.mp3'
import moneySoundPath from '../../assets/sounds/money.mp3'
import workSoundPath from '../../assets/sounds/workS.mp3'
import GAME_CONFIG from '../../constants/gameConfig'

// custom hook
import useSound from '../../hooks/useSound'
import gameReducer from '../../context/GameContext'
import useLocations from '../../hooks/useLocations'
import useHomeAction from '../../hooks/useHomeAction'
import useGameSave from '../../hooks/useGameSave'

// images
import homeImage from '../../assets/images/home.jpg'
import streetImage from '../../assets/images/street.jpg'
import storeImage from '../../assets/images/store.jpeg'
import workImage from '../../assets/images/work.png'
import officeImage from '../../assets/images/office.png'
import buldingImage from "../../assets/images/build.png";

import { useReducer, useState, useMemo, useRef, useEffect, useContext } from "react";
import Modal from "../Modal/Modal";
import { ThemeContext } from "../../context/ThemeContext";

export default function GameWrapper(){
  const [gameState, dispatch] = useReducer(gameReducer , {
    health: GAME_CONFIG.INITIAL_HEALTH,
    money: GAME_CONFIG.INITIAL_MONEY,
    food: GAME_CONFIG.INITIAL_FOOD
    
  })

  const [view, setView] = useState(false)
  const locationImages ={
    home: homeImage,
    street: streetImage,
    store: storeImage,
    work: workImage,
    office: officeImage,
    bulding:buldingImage,
  }

  const [location, setLocation] = useState<keyof typeof locationImages>("home")
  const locationUrl = useMemo(() => locationImages[location] , [locationImages, location])
  const timerRef = useRef<number | null>(null)
  const [modal, setModal] = useState(false)
  const [textModal, setTextModal] = useState("")
  const [transition, setTransition] = useState(false)
  const [sleeping, setSleeping] = useState(false)
  const [viewBuild, setViewBuild] = useState(false)
  const soundStreet = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundStreetPlay, stopSound:soundStreetStop} = useSound({soundRef: soundStreet, soundPath: streetSoundPath})
  const soundHome = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundHomePlay, stopSound:soundHomeStop} = useSound({soundRef: soundHome, soundPath: homeSoundPath})
  const soundStore = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundStorePlay, stopSound:soundStoreStop} = useSound({soundRef: soundStore, soundPath: storeSoundPath})
  const soundEat = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundEatPlay} = useSound({soundRef: soundEat, soundPath: eatSoundPath})
  const soundSleep = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundSleepPlay} = useSound({soundRef: soundSleep, soundPath: sleepSoundPath})
  const soundMoney = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundMoneyPlay} = useSound({soundRef: soundMoney, soundPath: moneySoundPath})
  const soundWork = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundWorkPlay, stopSound:soundWorkStop} = useSound({soundRef: soundWork, soundPath: workSoundPath})
  const [, setWorkingTime] = useState(0)
  const {theme}  =  useContext(ThemeContext)
  const startTransition = () => {
    if(timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setTransition(false)
    requestAnimationFrame(() => setTransition(true))
    timerRef.current = window.setTimeout(() => {
      setTransition(false)
      timerRef.current = null
    }, 4000)
  }
  
  const { goOutside, goHome, goStore, work, goBuilding, goOffice } = useLocations({
    setLocation,
    setView,
    setViewBuild,
    setTransition,
    startTransition,
    soundStreetPlay,
    soundHomePlay,
    soundStorePlay,
    soundWorkPlay,
    soundStreetStop,
    soundHomeStop,
    soundStoreStop,
    soundWorkStop,
  })

  const {sleep, eat, buyMeat, buyBread} = useHomeAction({
    dispatch,
    gameState,
    setModal,
    setSleeping,
    setTextModal,
    soundSleepPlay,
    soundEatPlay,
    soundMoneyPlay,
  })
  useEffect(()=>{
    loadGame()
  }, [])
  
  useEffect(()=>{
    const preloadImage = () => {
      const promises = Object.values(locationImages).map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        })
      })
      Promise.all(promises)
      .then(() => {})
      .catch((err) => {console.error("Error loading images", err)})
    }
    preloadImage()
  }, [])


    
  useEffect(() => {
    if(gameState.health <= 0) {
      dispatch({type:'RESET'})
      setLocation("home")
      setTextModal("GAME OVER!")
      setModal(true)
      setView(false)
      setViewBuild(false)
    }
    else if(gameState.health > GAME_CONFIG.MAX_HEALTH) {
      dispatch({type:'RESET_HEALTH'})
    }
  }, [gameState.health])
 
  useEffect(()=>{
   if(viewBuild) {
      const intervalId = setInterval(() => {
        dispatch({type:'WORK_BUILD'})
        setWorkingTime(e => e + 5)
      }, 4000)
      
      return () => {
        clearInterval(intervalId);
        setModal(true);
        setWorkingTime(prev => {
        setTextModal(`your earnings amounted to: ${prev}`)
          return 0
        })
    }
  }


  else if(view){
      const intervalId = setInterval(() => {
        dispatch({type:'WORK_OFFICE'})
        setWorkingTime(e => e + 10)
      }, 4000)
      
      return () => {
        clearInterval(intervalId);
        setModal(true);
        setWorkingTime(prev => {
        setTextModal(`your earnings amounted to: ${prev}`)
        return 0
      })
    }
  }
  }, [viewBuild, view])



const { saveGame, loadGame } = useGameSave({
  gameState,
  location,
  locationUrl,
  dispatch,
  setLocation,
  setModal,
  setTextModal,
});


const btnContainer = {
    display:sleeping ? "none" : "flex",
}

  return(
    <>
     <Modal viewModal={modal} setModal={setModal}>{textModal}</Modal>
        <div className={`game-wrapper ${theme}`}>
            <PlayerInfo money={gameState.money} health={gameState.health} food={gameState.food} />
            <WorkPlace view={view}/>
                {viewBuild ? (
                <Bulding containerWidth={500} containerHeight={500} viewBuild={viewBuild} />
                ) : (
                <ImagePlace transition={transition} url={locationImages[location]} />
                )}
            
            {sleeping && <div>Sleeping...</div>}       
            <div className="buttons-container" style={btnContainer}>
            <LocationButtons
                location={location}
                actions={{ goOutside, goHome, goStore, work, goBuilding, goOffice, sleep, eat, buyBread, buyMeat }}
            />
                <Button onClick={saveGame}>💾 Save Game</Button>
                
            </div>
        </div>
    </>
    )
}

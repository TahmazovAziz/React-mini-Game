import {  useEffect, useMemo, useReducer, useRef, useState} from 'react'
import type { RefObject } from 'react'
import './App.css'
// component
import Button from './Components/Button/Button'
import Modal from './Components/Modal/Modal'
import WorkPlace from './Components/WorkPlace/WorkPlace'
import ImagePlace from './Components/ImagePlace/ImagePlace'
import PlayerInfo from './Components/PlayerInfo/PlayerInfo'
import Bulding from './Components/Bulding/Bulding'
// images
import homeImage from './assets/images/home.jpg'
import streetImage from './assets/images/street.jpg'
import storeImage from './assets/images/store.jpeg'
import workImage from './assets/images/work.png'
import officeImage from './assets/images/office.png'

// audio
import streetSoundPath from './assets/sounds/street.mp3'
import homeSoundPath from './assets/sounds/home.mp3'
import storeSoundPath from './assets/sounds/store.mp3'
import eatSoundPath from './assets/sounds/eat.mp3'
import sleepSoundPath from './assets/sounds/sleep.mp3'
import moneySoundPath from './assets/sounds/money.mp3'
import workSoundPath from './assets/sounds/workS.mp3'
import useSound from './hooks/useSound'
import GAME_CONFIG from './constants/gameConfig.ts'
import gameReducer from './context/GameContext.tsx'

function App() {

  const [gameState, dispatch] = useReducer(gameReducer , {
    health: GAME_CONFIG.INITIAL_HEALTH,
    money: GAME_CONFIG.INITIAL_MONEY,
    food: GAME_CONFIG.INITIAL_FOOD
    
  })



  const [view, setView] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
////////
  const locationImages ={
    home: homeImage,
    street: streetImage,
    store: storeImage,
    work: workImage,
    office: officeImage,
    bulding:'string',
  }
  const [location, setLocation] = useState<keyof typeof locationImages>("home")
  const [locationUrl, setLocationUrl] = useMemo(() => locationImages[location] , [locationImages, location])
////////
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
  const {playSound:soundEatPlay, stopSound:soundEatStop} = useSound({soundRef: soundEat, soundPath: eatSoundPath})
  const soundSleep = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundSleepPlay, stopSound:soundSleepStop} = useSound({soundRef: soundSleep, soundPath: sleepSoundPath})
  const soundMoney = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundMoneyPlay, stopSound:soundMoneyStop} = useSound({soundRef: soundMoney, soundPath: moneySoundPath})
  const soundWork = useRef<HTMLAudioElement | null>(null)
  const {playSound:soundWorkPlay, stopSound:soundWorkStop} = useSound({soundRef: soundWork, soundPath: workSoundPath})
  const [workingTime, setWorkingTime] = useState(0)
  

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
      .then(() => {setImagesLoaded(true)})
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


  const changeLocation = (
    newlocation:keyof typeof locationImages,
    options?:{
      playSound?:()=>void,
      stopSound?:(()=>void)[],
      setViewBuild?:boolean,
      setView?:boolean,
    }
  ) => {
    setLocation(newlocation)
    if(options?.stopSound){
      options.stopSound.forEach(stop => stop())
    }
    if(options?.playSound){
      options.playSound();
    }
    if(options?.setViewBuild !== undefined ){
      setViewBuild(options.setViewBuild)
    }
    if(options?.setView !== undefined){
      setView(options.setView)
    }
  
  }
  const saveGame = () => {
    try{
      const saveGame = {
        gameState,
        location,
        locationUrl,
        timestemp:new Date().toISOString()
      }
      window.localStorage.setItem('game_save', JSON.stringify(saveGame))
      setModal(true);
      setTextModal('Game saved ✅');
    }
    catch(error){
      console.error("Error saving game:", error)
      setModal(true);
      setTextModal(`An error occurred, please try again later ❌`)
    }
  }

  const loadGame = () => {
    try {
      if(typeof window === 'undefined') return;

      const result = window.localStorage.getItem('game_save')
      if(result){
        const saveData = JSON.parse(result)
        dispatch({type:'LOAD_GAME', payload:saveData.gameState})
        setLocation(saveData.location)
      }
    }
    catch (error){
      console.error("Error loading game:", error)
    }
  }

  
  const startTransition = () => {
    if(timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setTransition(false)
    requestAnimationFrame(() => setTransition(true))

    timerRef.current = setTimeout(() => {
      setTransition(false)
      timerRef.current = null
    }, 4000)
  }


  
  const goOutside = () => {
    changeLocation("street",{
      playSound:soundStreetPlay,
      stopSound:[soundHomeStop, soundStoreStop, soundWorkStop],
      setView:false,
      setViewBuild:false
    })
  }


const sleep = () => {
  if(gameState.health < 30){
    dispatch({type:'SLEEP'});
    setSleeping(true);
    setTimeout(() => {setSleeping(false)}, 4000);
    soundSleepPlay();
  }
  else{
      setModal(true);
      setTextModal("You can't sleep if your health is over 30");
  }
}

const eat = () => {   
    dispatch({type:'EAT'});
    if(gameState.food === 0 || gameState.health >= GAME_CONFIG.MAX_HEALTH){
      setModal(true);
      setTextModal("Not enough food or you are full"); 
    }
    else{
      soundEatPlay()
    }
};





const buyMeat  = () => {
  if(gameState.money >= GAME_CONFIG.MEAT_COST){
    dispatch({type:'BUY_MEAT'})
    soundMoneyPlay();
  }
  else{
    setModal(true)
    setTextModal("Not enough money")
  }
};

const buyBread = () => {
  if(gameState.money >= GAME_CONFIG.BREAD_COST){
    dispatch({type:'BUY_BREAD'})
    soundMoneyPlay()
  }
  else{
    setModal(true)
    setTextModal("Not enough money")
  }
}


  const work = () => {
    changeLocation("work",{
      playSound:soundWorkPlay,
      stopSound:[soundStreetStop],
    })  
    setViewBuild(false)
    setView(false)

 
  }


  const goHome = () => {
    changeLocation("home",{
      playSound:soundHomePlay,
      stopSound:[soundStreetStop],

    })
    setTransition(true)
    startTransition()
  }


 const goStore = () => {
  changeLocation("store",{
    playSound:soundStorePlay,
    stopSound:[soundStreetStop],
  })  
    setTransition(true)
    startTransition()
  }

  const goBuilding = () => {
    changeLocation("bulding",{
      playSound:soundStorePlay,
      stopSound:[soundWorkStop, soundStreetStop],
      setView:false,
      setViewBuild:true
    }) 
  }

  const goOffice = () => {
    changeLocation("office",{
      playSound:soundStorePlay,
      stopSound:[soundStreetStop, soundWorkStop],
      setView:true,
      setViewBuild:false
    }) 
  }

 // buttons

  type ButtonType = {
    onClick: () => void,
    text: string
  }

  const renderButtons = () => {
    const buttons: Record<string , ButtonType[]> = {
      home:[
        {onClick: goOutside,  text: "🏙️ Go outside"},
        {onClick: sleep,  text: "😴 Sleep"},
        {onClick: eat,  text: "🍽️ Eat"},
      ],
      street:[
        {onClick: work,  text: "💼 Go to work"},
        {onClick: goStore,  text: "🏪 Go to the store"},
        {onClick: goHome,  text: "🏠 Go home"},
      ],
      store:[
        {onClick: buyBread,  text: "🍞 Buy bread"},
        {onClick: buyMeat,  text: "🥩 Buy meat"},
        {onClick: goOutside,  text: "🏙️ Go outside"},
      ],
      work:[
        {onClick: goBuilding,  text: "🧱 Go building"},
        {onClick: goOffice,  text: "🏢 Go office"},
        {onClick: goOutside,  text: "🏙️ Go outside"},
      ],
      bulding:[
        {onClick: goOutside,  text: "🏙️ Go outside"},
      ],
      office:[
        {onClick: goOutside,  text: "🏙️ Go outside"},
      ]
    }
    return buttons[location]?.map((btn:ButtonType, i:number) => (
      <Button key={i} onClick={btn.onClick}>{btn.text}</Button>
    ))
  }

  const hideModal = () => {
      setModal(false)
  }

  const btnContainer = {
     display:sleeping ? "none" : "flex",
  }

  return (
    <>
      <Modal viewModal={modal} hideModal={hideModal}>{textModal}</Modal>
      <div className="game-wrapper">
        <PlayerInfo money={gameState.money} health={gameState.health} food={gameState.food} />
        <WorkPlace view={view}/>
        
          {viewBuild ? (
            <Bulding containerWidth={500} containerHeight={500} viewBuild={viewBuild} />
          ) : (
            <ImagePlace transition={transition} url={locationImages[location]} />
          )}
        
        {sleeping && <div>Sleeping...</div>}       
        <div className="buttons-container" style={btnContainer}>
          {renderButtons()}
          <Button onClick={saveGame}>💾 Save Game</Button>
        </div>

      </div>
    </>
  )
}

export default App
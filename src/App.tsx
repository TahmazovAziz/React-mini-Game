import {  useEffect, useReducer, useRef, useState} from 'react'
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

function App() {

 const GAME_CONFIG = {
  INITIAL_HEALTH: 100,
  INITIAL_MONEY: 0,
  INITIAL_FOOD: 0,
  MAX_HEALTH: 100,
  SLEEP_HEALTH_INCREASE: 30,
  EAT_HEALTH_INCREASE: 10,
  BREAD_COST: 5,
  BREAD_FOOD_INCREASE: 1,
  MEAT_COST: 10,
  MEAT_FOOD_INCREASE: 2,
  WORK_HEALTH_DECREASE: 1,
  WORK_MONEY_INCREASE: 1,
  EAT_FOOD_DECREASE: 1,
 }


  type GameState = {
    health: number;
    money: number;
    food: number;
  }


 type GameAction = 
  | {type:'EAT'}
  | {type:'SLEEP'}
  | {type:'BUY_BREAD'}
  | {type:'BUY_MEAT'}
  | {type:'RESET'}
  | {type:'RESET_HEALTH'}
  | {type:'WORK_BUILD'}
  | {type:'WORK_OFFICE'}
  | {type:'LOAD_GAME', payload:GameState}

  const gameReducer = (state:GameState, action:GameAction) => {
    switch(action.type) {
      case 'EAT':
        if(state.food > 0 && state.health < GAME_CONFIG.MAX_HEALTH) {
          return {
            ...state,
            food: state.food - GAME_CONFIG.EAT_FOOD_DECREASE,
            health: Math.min(state.health + GAME_CONFIG.EAT_HEALTH_INCREASE, GAME_CONFIG.MAX_HEALTH)
          }
        }
        return state
        case 'SLEEP':
          if(state.health < 70) {
            return {
              ...state,
              food: state.food - GAME_CONFIG.EAT_FOOD_DECREASE,
              health: Math.min(state.health + GAME_CONFIG.SLEEP_HEALTH_INCREASE, 100)
            }
          }
          return state
        case 'BUY_BREAD':
          if(state.money  >= GAME_CONFIG.BREAD_COST) {
            return {
              ...state,
              money: state.money - GAME_CONFIG.BREAD_COST,
              food: state.food + GAME_CONFIG.BREAD_FOOD_INCREASE
            }
          }
          return state
        case 'BUY_MEAT':
          if(state.money  >= GAME_CONFIG.MEAT_COST) {
            return {
              ...state,
              money: state.money - GAME_CONFIG.MEAT_COST,
              food: state.food + GAME_CONFIG.MEAT_FOOD_INCREASE
            }
          }
          return state;
        case 'WORK_BUILD':
            return {
              ...state,
              money:state.money + 5,
              health:state.health - 15
            }
        case 'WORK_OFFICE':
          return {
            ...state,
            money:state.money + 10,
            health:state.health - 10
          }
        case 'RESET_HEALTH':
          return {
            ...state,
            health:GAME_CONFIG.INITIAL_HEALTH,
          }
        case 'RESET':
          return {
            health:GAME_CONFIG.INITIAL_HEALTH,
            money:GAME_CONFIG.INITIAL_MONEY,
            food:GAME_CONFIG.INITIAL_FOOD
          }
        case 'LOAD_GAME':
          return action.payload
      default:
        return state
    }
  }

  const [gameState, dispatch] = useReducer(gameReducer , {
    health: GAME_CONFIG.INITIAL_HEALTH,
    money: GAME_CONFIG.INITIAL_MONEY,
    food: GAME_CONFIG.INITIAL_FOOD
    
  })



  const [view, setView] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const locationImages ={
    home: homeImage,
    street: streetImage,
    store: storeImage,
    work: workImage,
    office: officeImage
  }
  const [locationUrl, setLocationUrl] = useState(locationImages.home)
  const timerRef = useRef<number | null>(null)
  const [location, setLocation] = useState("home")
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
      setLocationUrl(locationImages.home)
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
        setLocationUrl(saveData.locationUrl)
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
    setLocation("street")
    setLocationUrl(locationImages.street)
    setView(false)
    setTransition(true)
    setTimeout(() => {setTransition(false)}, 1000)
    soundStreetPlay()
    soundHomeStop()
    soundStoreStop()
    setViewBuild(false)
    soundWorkStop()
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
    

    setLocation("work")
    setLocationUrl(locationImages.work)
    setTransition(true)
    startTransition()
    soundWorkPlay()
    soundStreetStop()
    
  }


  const goHome = () => {
    setLocation("home")
    setLocationUrl(locationImages.home)
    setView(false)
    setTransition(true)
    startTransition()
    soundHomePlay()
    soundStreetStop()
    
  }


 const goStore = () => {
    setLocation("store")
    setLocationUrl(locationImages.store)
    setTransition(true)
    startTransition()
    soundStorePlay()
    soundStreetStop()
    
  }

  const goBuilding = () => {
    setLocation("bulding")
    setViewBuild(true)
    soundStreetStop()
    soundWorkStop()
  }

  const goOffice = () => {
    setLocation("office")
    setLocationUrl(locationImages.office)
    setView(true)
    soundStreetStop()
    soundWorkStop()

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
            <ImagePlace transition={transition} url={locationUrl} />
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
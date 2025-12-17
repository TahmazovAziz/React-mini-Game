
import GAME_CONFIG from "../constants/gameConfig";
import type { Dispatch } from 'react';
import type { GameAction, GameState } from '../context/GameContext'; // нужно экспортнуть эти типы из GameContext

type useHomeAction = {
    setModal:(val:boolean) => void;
    setSleeping:(val:boolean) => void;
    soundSleepPlay:()=>void;
    setTextModal:(val:string) => void;
    soundEatPlay:() => void;
    soundMoneyPlay:() => void;
    dispatch: Dispatch<GameAction>;
    gameState: GameState;
}

export default function useHomeAction({setModal, setSleeping, soundSleepPlay, setTextModal , soundEatPlay,soundMoneyPlay, gameState, dispatch } : useHomeAction){
    
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
      return{buyBread, buyMeat, eat, sleep  }
}
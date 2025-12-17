import { useCallback } from 'react';
import type { GameState, GameAction } from '../context/GameContext';
import type { Dispatch, SetStateAction } from 'react';
import type { LocationKey } from './useLocations';

type UseGameSaveDeps = {
  gameState: GameState;
  location: LocationKey;
  locationUrl: string;
  dispatch: Dispatch<GameAction>;
  setLocation: Dispatch<SetStateAction<LocationKey>>;
  setModal: (val: boolean) => void;
  setTextModal: (val: string) => void;
};

export default function useGameSave({
  gameState,
  location,
  locationUrl,
  dispatch,
  setLocation,
  setModal,
  setTextModal,
}: UseGameSaveDeps) {
    const saveGame = useCallback(()=>{
        try{
            const saveData = {
                gameState,
                location,
                locationUrl,
                timestemp: new Date().toISOString(),
            };
            window.localStorage.setItem('game_save', JSON.stringify(saveData))
            setModal(true);
            setTextModal('Game saved ✅');
        }
        catch(error){
            console.error("Error saving game:", error)
            setModal(true);
            setTextModal(`An error occurred, please try again later ❌`)
        }
    }, [gameState, location, locationUrl, setModal, setTextModal])

    const loadGame = useCallback(() => {
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
      }, [dispatch, setLocation])

    return { saveGame, loadGame };
}
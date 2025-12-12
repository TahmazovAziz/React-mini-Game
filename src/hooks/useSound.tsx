import type { RefObject } from 'react'

interface UseSoundProps {
    soundRef:RefObject<HTMLAudioElement | null>,
    soundPath?:string,
}

export default function useSound({soundRef: soundRef, soundPath: soundPath}:UseSoundProps){
  const playSound = () =>{
    if (!soundRef.current) {soundRef.current = new Audio(soundPath)}
    if (soundRef.current) {
      if(!soundRef.current.play()){
        try{
          soundRef.current.currentTime = 0
          soundRef.current.play()
        }
        catch(er){
          console.log('Error sound' + er)
        }
      }
    }
  }

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.pause()
      soundRef.current.currentTime = 0
    }
  }

  return {
    playSound,
    stopSound
  }
}

import { useCallback, type Dispatch, type SetStateAction } from "react";

export type LocationKey = 'home' | 'street' | 'store' | 'work' | 'office' | 'bulding';

type ChangeLocationOptions = {
  playSound?: () => void;
  stopSound?: Array<()=>void>;
  setView?:boolean;
  setViewBuild?:boolean;
  withTransition?:boolean;
}
type LocationDeps = {
  setLocation: Dispatch<SetStateAction<LocationKey>>;
  setView: (v: boolean) => void;
  setViewBuild: (v: boolean) => void;
  setTransition: (v: boolean) => void;
  startTransition: () => void;
  soundStreetPlay: () => void;
  soundHomePlay: () => void;
  soundStorePlay: () => void;
  soundWorkPlay: () => void;
  soundStreetStop: () => void;
  soundHomeStop: () => void;
  soundStoreStop: () => void;
  soundWorkStop: () => void;
};

export default function useLocations({
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
}:LocationDeps){
  const changeLocation = useCallback((newLoc:LocationKey,options?:ChangeLocationOptions) => {
    setLocation(newLoc);
    options?.stopSound?.forEach(stop => stop())
    options?.playSound?.()
    if(options?.setView !== undefined) setView(options.setView);
    if(options?.setViewBuild !== undefined) setViewBuild(options.setViewBuild)
    if(options?.withTransition){
      setTransition(true);
      startTransition();
    }
  }, [setLocation, setView, setViewBuild, setTransition, startTransition]);
  const goOutside = () => {
    changeLocation('street', {
      playSound: soundStreetPlay,
      stopSound: [soundHomeStop, soundStoreStop, soundWorkStop],
      setView: false,
      setViewBuild: false,
    })
  }
  const goHome = () =>
    changeLocation('home', {
      playSound: soundHomePlay,
      stopSound: [soundStreetStop],
      setView: false,
      setViewBuild: false,
      withTransition: true,
  });
  const goStore = () =>
    changeLocation('store', {
      playSound: soundStorePlay,
      stopSound: [soundStreetStop],
      setView: false,
      setViewBuild: false,
      withTransition: true,
    });

  const work = () =>
    changeLocation('work', {
      playSound: soundWorkPlay,
      stopSound: [soundStreetStop],
      setView: false,
      setViewBuild: false,
    });

  const goBuilding = () =>
    changeLocation('bulding', {
      stopSound: [soundWorkStop],
      setView: false,
      setViewBuild: true,
    });
  const goOffice = () =>
      changeLocation('office', {
        stopSound: [soundWorkStop],
        setView: true,
        setViewBuild: false,
  });
  return { goOutside, goHome, goStore, work, goBuilding, goOffice };
};

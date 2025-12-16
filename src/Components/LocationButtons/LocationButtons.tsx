import Button from '../Button/Button'
import type { LocationKey } from '../../hooks/useLocations'

type ButtonType = {
    onClick: () => void;
    text:string;
}

type LocationButtonProps = {
    location: LocationKey;
    actions:{
        goOutside: () => void;
        goHome: () => void;
        goStore: () => void;
        work: () => void;
        goBuilding: () => void;
        goOffice: () => void;
        sleep: () => void;
        eat: () => void;
        buyBread: () => void;
        buyMeat: () => void;   
    };
};

export default function LocationButtons({location, actions}: LocationButtonProps){
    const { goOutside, goHome, goStore, work, goBuilding, goOffice, sleep, eat, buyBread, buyMeat } = actions

        const buttons: Record<LocationKey , ButtonType[]> = {
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
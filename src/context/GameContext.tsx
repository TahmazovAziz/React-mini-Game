import GAME_CONFIG from '../constants/gameConfig';

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

type GameState = {
    health: number;
    money: number;
    food: number;
  }

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
export default gameReducer;
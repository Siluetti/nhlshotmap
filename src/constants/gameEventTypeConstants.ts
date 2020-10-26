import GameEventTypeInterface from "../typescript/interfaces/GameEventTypeInterface";

export const GAME_EVENT_TYPE_OPTIONS:GameEventTypeInterface[] = [
    { value: 'FACEOFF', label: 'Faceoffs', color: '#FF0000' },
    { value: 'HIT', label: 'Hits', color: '#D789D7' },
    { value: 'BLOCKED_SHOT', label: 'Blocked shots', color: '#00FF00' },
    { value: 'SHOT', label: 'Shots', color: '#000000' },
    { value: 'TAKEAWAY', label: 'Takeaways', color: '#FF5200' },
    { value: 'MISSED_SHOT', label: 'Missed shots', color: '#0000FF' },
    { value: 'GOAL', label: 'Goals', color: '#d2e603' },
    { value: 'GIVEAWAY', label: 'Giveaways', color: '#6F0000' },
    { value: 'PENALTY', label: 'Penalties', color: '#F0A500' },
  ];

  // default game event is "shot"
export const DEFAULT_GAME_EVENT_INDEX:number = 3;
    
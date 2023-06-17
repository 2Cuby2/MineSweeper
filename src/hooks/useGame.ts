import { useContext } from 'react';

import { GameContext } from '../providers';


export default function useGame() {
  return useContext(GameContext);
}

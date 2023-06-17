import { useContext } from 'react';

import { GameManagerContext } from '../providers';


export default function useGameManager() {
    return useContext(GameManagerContext);
}

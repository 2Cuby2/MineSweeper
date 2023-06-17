import { useContext } from 'react';

import { TimerManagerContext } from '../providers';


export default function useTimerManager() {
    return useContext(TimerManagerContext);
}

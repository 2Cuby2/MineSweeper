import { useContext } from 'react';

import { TimerContext } from '../providers';


export default function useTimer() {
  return useContext(TimerContext);
}

import React, {
    createContext,
    useState,
    useEffect,
} from 'react';


type TimerContextType = {
    value: { min: number, sec: number };
    start: () => void;
    reset: () => void;
};
export const TimerContext = createContext<TimerContextType>({
    value: { min: 0, sec: 0 },
    start: () => {},
    reset: () => {},
});


type TimerProviderProps = { children: JSX.Element };
function TimerProvider({ children }: TimerProviderProps) {
    const [hasTimerStarted, setHasTimerStarted] = useState(false);
    const [value, setValue] = useState({ min: 0, sec: 0 });

    useEffect(() => {
        if (hasTimerStarted) {
            const interval = setInterval(() => {
                setValue((value) => {
                    if (value.sec === 59) {
                        return { min: value.min + 1, sec: 0 };
                    }
                    return { min: value.min, sec: value.sec + 1 };
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [hasTimerStarted]);

    const start = () => setHasTimerStarted(true);

    const reset = () => {
        setHasTimerStarted(false);
        setValue({ min: 0, sec: 0 });
    }

    return (
      <TimerContext.Provider value={{ value, start, reset }}>
        {children}
      </TimerContext.Provider>
    );
}


export default TimerProvider;

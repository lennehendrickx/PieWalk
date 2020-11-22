import { useCallback, useEffect, useState } from 'react';
import { EventEmitter, EventKey, EventMap } from '../model/player/EventEmitter';

export default function useEmitterState<S, T extends EventMap, K extends EventKey<T>>(
    target: EventEmitter<T>,
    eventName: K,
    eventMapper: (event: T[K]) => S | undefined = (event) => event,
    defaultState: S | undefined = undefined
): S | undefined {
    const [state, setState] = useState<S | undefined>(defaultState);

    const handleEventEmitted = useCallback(
        (event) => {
            const state = eventMapper(event);
            return setState(state);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setState]
    );

    useEffect(() => {
        target.on(eventName, handleEventEmitted);
        return () => target.off(eventName, handleEventEmitted);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleEventEmitted]);

    return state;
}

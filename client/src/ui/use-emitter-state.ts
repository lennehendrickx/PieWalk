import { useCallback, useEffect, useState } from 'react';
import { EventEmitter, EventKey, EventMap } from '../model/player/EventEmitter';

type EmitterStateProps<S, T extends EventMap, K extends EventKey<T>> = {
    target: EventEmitter<T>;
    eventName: K;
    eventMapper?: (event: T[K]) => S;
    initialState?: S;
};

export default function useEmitterState<S, T extends EventMap, K extends EventKey<T>>({
    target,
    eventName,
    eventMapper = (event) => event,
    initialState,
}: EmitterStateProps<S, T, K>): S | undefined {
    const [state, setState] = useState<S | undefined>(initialState);

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
    }, [handleEventEmitted]);

    return state;
}

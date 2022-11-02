import {
    useState,
    useRef,
    useEffect,
    useCallback,
    Dispatch,
    SetStateAction,
  } from 'react';
  
  /**
   * custom hook that avoids the issue of set state on an unmounted component\
   * copy useState typescript function signature
   * @param {S} initialState
   */
  function useSafeState<S>(
    initialState: S | (() => S)
  ): [state: S, setState: Dispatch<SetStateAction<S>>] {
    const [state, setState] = useState<S>(initialState);
    const isMounted = useRef<boolean>(true);
  
    // keep track of mount/unmount
    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);
  
    // "fake" setState that we'll return to the user of the hook
    // it will check if mounted before calling the actual setState
      const customSetState = useCallback<Dispatch<SetStateAction<S>>>((newStateOrSetter) => {
      if (!isMounted.current) {
        return;
      }
      setState(newStateOrSetter);
    }, []);
  
    return [state, customSetState];
  }
  
  export default useSafeState;
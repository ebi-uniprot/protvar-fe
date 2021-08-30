import { useEffect, useRef } from 'react';

import useSafeState from './useSafeState';

const useCustomElement = (
  customElementGetter: () => Promise<{ default: CustomElementConstructor }>,
  name: string
) => {
  const [defined, setDefined] = useSafeState(
    Boolean(window.customElements && window.customElements.get(name))
  );

  // as it's a function, it might have been redefined through a rerender pass,
  // so keep that in a ref to avoid the useEffect to rerun needlessly
  const CEgetter = useRef(customElementGetter);

  useEffect(() => {
    // customElements not supported, bail
    if (!window.customElements) {
      return;
    }
    // already instantiated, update state and bail
    if (window.customElements.get(name)) {
      setDefined(true);
      return;
    }
    CEgetter.current()
      .then((module) => {
        // 'get' is experimental apparently
        if (!window.customElements.get?.(name)) {
          try {
            window.customElements.define(name, module.default);
          } catch (err) {
            /**/
          }
        }
        setDefined(true);
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }, [name, setDefined]);

  return defined;
};

export default useCustomElement;
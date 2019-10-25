import keys from "./key-codes";

const keyboardEventHandler = handlers => {
  let shiftKey = false;

  const setShiftKey = e => {
    if (handlers.preventDefault) e.preventDefault();

    if (e.which === 16) {
      shiftKey = true;
    }
  };
  const desetShiftKey = e => {
    if (handlers.preventDefault) e.preventDefault();

    if (e.which === 16) {
      shiftKey = false;
    }
  };

  const handlerKeys = Object.keys(handlers);
  /* eslint-disable */
  const handleEvent = e => {
    if (handlers.preventDefault) e.preventDefault();
    const key = shiftKey ? `shift_${keys[e.which]}` : keys[e.which];

    if (handlerKeys.includes(key)) {
      handlers[key](e);
    }
  };

  return {
    addListener: () => {
      document.addEventListener(handlers.type, handleEvent, handlers.options);
      document.addEventListener("keydown", setShiftKey, true);
      document.addEventListener("keyup", desetShiftKey, true);
    },
    removeListener: () => {
      document.removeEventListener(
        handlers.type,
        handleEvent,
        handlers.options
      );
      document.removeEventListener("keydown", setShiftKey, true);
      document.removeEventListener("keyup", desetShiftKey, true);
    }
  };
};

export default keyboardEventHandler;

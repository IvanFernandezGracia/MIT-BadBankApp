const addEventListeners = (eventType, listener) => {
  document.addEventListener(eventType, listener);
};

const removeEventListeners = (eventType, listener) => {
  document.removeEventListener(eventType, listener);
};

// const onceEventListeners = (eventType, listener) => {
//   addEventListeners(eventType, handleEventOnce);

//   const handleEventOnce = (event) => {
//     listener(event);
//     removeEventListeners(eventType, handleEventOnce);
//   };
// };

const triggerEventListeners = (eventType, data) => {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
};

export {
  addEventListeners,
  removeEventListeners,
  triggerEventListeners,
  // onceEventListeners,
};

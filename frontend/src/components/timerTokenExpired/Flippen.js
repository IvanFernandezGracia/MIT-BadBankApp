import React, { useRef, useEffect } from "react";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";

export const Flippen = ({ value }) => {
  const divRef = useRef();
  const tickRef = useRef();

  useEffect(() => {
    const didInit = (tick) => {
      tickRef.current = tick;
    };

    const currDiv = divRef.current;
    const tickValue = tickRef.current;
    Tick.DOM.create(currDiv, {
      value,
      didInit,
    });
    return () => Tick.DOM.destroy(tickValue);
  });

  useEffect(() => {
    if (tickRef.current) {
      tickRef.current.value = value;
    }
  }, [value]);

  return (
    <div ref={divRef} className="tick">
      <div data-repeat="true">
        <span style={{}} data-view="flip">
          Tick
        </span>
      </div>
    </div>
  );
};

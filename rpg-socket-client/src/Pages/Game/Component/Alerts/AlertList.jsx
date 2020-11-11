import React from "react";
import { useTransition, animated } from "react-spring";
import { Alert } from "./Alert";

const AlertList = ({ alerts, cleanAlertFromArray }) => {
  const transitions = useTransition(alerts, (alert) => alert?.id, {
    from: { transform: "translate3d(400px,0,0)" },
    enter: { transform: "translate3d(0,0,0)" },
    leave: { transform: "translate3d(400px,0,0)" },
  });
  return (
    <div className="absolute mx-auto my-4 md:top-0 md:right-0 md:m-4 space-y-4">
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          <Alert
            key={item?.id}
            message={item?.message}
            title={item?.title}
            id={item?.id}
            cleanArray={cleanAlertFromArray}
          />
        </animated.div>
      ))}
    </div>
  );
};

export { AlertList };

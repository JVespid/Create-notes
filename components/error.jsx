import React from "react";
import "../sass/error.scss";

const Error = ({ name, message, type, typeBColor, typeLColor }) => {
  let bColor, lColor;

  if (type == "critical" || type == "error" || !type) {
    bColor = "red";
    lColor = "white";
  }
  if (type == "warning") {
    bColor = "yellow";
    lColor = "black";
  }

  if (type == "successfully") {
    bColor = "green";
    lColor = "white";
  }

  bColor = typeBColor ? typeBColor : bColor;
  lColor = typeLColor ? typeLColor : lColor;

  const style = {
    backgroundColor: bColor,
    color: lColor,
  };

  return (
    <div style={style} className="content">
      <h3 className="title">{name}</h3> <p className="text">{message}</p>
    </div>
  );
};

export default Error;

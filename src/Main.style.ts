import * as React from "react";

const goldColor = "#CC9900";
const lightBlueColor = "#2C97FA";

export const mainContainerStyle = (): React.CSSProperties => {
  return {
    margin: "10px",
    color: lightBlueColor,
  };
};

export const profileContainerStyle = (): React.CSSProperties => {
  return {
    paddingBottom: "5px",
  };
};

export const profileImageStyle = (): React.CSSProperties => {
  return {
    width: "64px",
    height: "64px",
    paddingRight: "5px",
  };
};

export const profileDataStyle = (): React.CSSProperties => {
  return {
    verticalAlign: "top",
  };
};

export const profileNameStyle = (): React.CSSProperties => {
  return {
    textDecorationLine: "none",
    color: goldColor,
  };
};

export const retroRatioPointsStyle = (): React.CSSProperties => {
  return {
    color: "white",
  };
};

export const achievementContainerStyle = (): React.CSSProperties => {
  return {
    backgroundColor: "#1b1e24",
    border: "1px solid black",
    borderRadius: "3px",
    padding: "2px",
    margin: "2px 0",
  };
};

export const achievementBadgeStyle = (isHardcore: boolean): React.CSSProperties => {
  return {
    width: "64px",
    height: "64px",
    border: "2px solid",
    borderColor: isHardcore ? goldColor : "transparent",
    marginRight: "5px",
  };
};

export const achievementTitleStyle = (): React.CSSProperties => {
  return {
    color: goldColor,
  };
};

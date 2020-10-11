import * as React from "react";

const goldColor = "#CC9900";
const lightBlueColor = "#2C97FA";

export const configContainerStyle = (): React.CSSProperties => {
  return {
    padding: "1em",
    backgroundColor: "#282c34",
    // 100% of the viewport height minus the top and bottom padding
    minHeight: "calc(100vh - 2em)",
    fontSize: "calc(8px + 2vmin)",
    color: lightBlueColor,
  };
};

export const instructionsStyle = (): React.CSSProperties => {
  return {
    fontSize: "calc(3px + 2vmin)",
    marginBottom: "1em",
  };
};

export const optionsStackStyle = (): React.CSSProperties => {
  return {
    marginBottom: "0.5em",
  };
};

export const labelStyle = (): React.CSSProperties => {
  return {
    // Add the buffer to the top that the inputs add in order to align the labels with the text boxes
    paddingTop: "2px",
  };
};

export const inputStackStyle = (): React.CSSProperties => {
  return {
    marginLeft: "0.5em",
  };
};

export const inputStyle = (): React.CSSProperties => {
  return {
    fontSize: "calc(4px + 2vmin)",
  };
};

export const linkStyle = (): React.CSSProperties => {
  return {
    color: goldColor,
    textDecorationLine: "none",
    cursor: "pointer",
  };
};

export const changesSavedIndicatorStyle = (): React.CSSProperties => {
  return {
    position: "relative",
    top: "2px",
    left: "6px",
  };
};

export const footerStyle = (): React.CSSProperties => {
  return {
    fontSize: "calc(4px + 1vmin)",
    position: "absolute",
    bottom: "1em",
    left: "1em",
  };
};

import { ICalloutContentStyles, ICheckboxStyles, ITextFieldStyles } from "@fluentui/react";
import * as React from "react";

const goldColor = "#CC9900";
const lightBlueColor = "#2C97FA";
const redWarningColor = "#FF2020";
const lightGrayColor = "#282c34";

export const configContainerStyle = (): React.CSSProperties => {
  return {
    padding: "1em",
    backgroundColor: lightGrayColor,
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
    marginRight: "0.5em",
  };
};

export const horizontalRuleStyle = (): React.CSSProperties => {
  return {
    borderColor: lightBlueColor,
    borderStyle: "solid",
  };
};

export const inputStackStyle = (): React.CSSProperties => {
  return {
    marginLeft: "0.5em",
  };
};

export const validationStackStyle = (): React.CSSProperties => {
  return {
    marginLeft: "0.5em",
  };
};

export const inputStyle = (width: string, textFieldError?: boolean): Partial<ITextFieldStyles> => {
  return {
    field: { width: width, fontSize: "calc(4px + 2vmin)" },
    fieldGroup: [textFieldError && { borderColor: redWarningColor }],
    errorMessage: {
      color: redWarningColor,
    },
  };
};

export const apiKeyCalloutStyle = (): Partial<ICalloutContentStyles> => {
  return {
    root: {
      maxWidth: "332px",
      border: "1px solid darkgoldenrod",
    },
    calloutMain: {
      padding: "5px",
      backgroundColor: lightGrayColor,
      color: lightBlueColor,
    },
    beak: {
      backgroundColor: lightGrayColor,
    },
  };
};

export const apiKeyCalloutHeaderStyle = (): React.CSSProperties => {
  return {
    textAlign: "center",
    paddingBottom: "0.5em",
  };
};

export const calloutQuoteStyle = (): React.CSSProperties => {
  return {
    color: goldColor,
  };
};

export const linkStyle = (): React.CSSProperties => {
  return {
    color: goldColor,
    textDecorationLine: "none",
    cursor: "pointer",
  };
};

export const checkboxStyle = (): Partial<ICheckboxStyles> => {
  return {
    text: {
      color: lightBlueColor,
    },
    // checkmark: {
    //   color: "white",
    // },
  };
};

export const buttonInputStyle = (): React.CSSProperties => {
  return {
    fontSize: "calc(4px + 2vmin)",
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

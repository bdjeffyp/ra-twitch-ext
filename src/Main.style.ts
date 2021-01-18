import * as React from "react";

const goldColor = "#CC9900";
const lightBlueColor = "#2C97FA";

export const mainContainerStyle = (): React.CSSProperties => {
  return {
    margin: "10px",
    color: lightBlueColor,
  };
};

export const loadingSpinnerStyle = (): React.CSSProperties => {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
};

export const profileContainerStyle = (isFirst: boolean, isLast: boolean): React.CSSProperties => {
  if (isFirst) {
    return {
      marginBottom: "5px",
    };
  }
  if (isLast) {
    return {
      paddingTop: "5px",
    };
  }
  return {
    marginBottom: "5px",
    paddingTop: "5px",
  };
};

export const profileImageStyle = (): React.CSSProperties => {
  return {
    width: "calc(60px + 4vmin)",
    height: "calc(60px + 4vmin)",
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
    cursor: "pointer",
  };
};

export const retroRatioPointsStyle = (): React.CSSProperties => {
  return {
    color: "white",
  };
};

export const lastGamePlayingContainerStyle = (isLast: boolean): React.CSSProperties => {
  if (isLast) {
    return {};
  }
  return {
    marginBottom: "5px",
  };
};

export const richPresenceContainerStyle = (): React.CSSProperties => {
  return {
    fontSize: "calc(6px + 2vmin)",
  };
};

export const recentAchievementsContainerStyle = (isLast: boolean): React.CSSProperties => {
  if (isLast) {
    return {};
  }
  return {
    marginBottom: "5px",
  };
};

export const achievementContainerStyle = (): React.CSSProperties => {
  return {
    backgroundColor: "#1b1e24",
    border: "1px solid black",
    borderRadius: "3px",
    padding: "2px",
    margin: "2px 0 0",
  };
};

export const achievementBadgeStyle = (isHardcore: boolean): React.CSSProperties => {
  return {
    width: "calc(32px + 4vmin)",
    height: "calc(32px + 4vmin)",
    border: "2px solid",
    borderColor: isHardcore ? goldColor : "transparent",
    marginRight: "5px",
    alignSelf: "center",
  };
};

export const achievementTitleStyle = (): React.CSSProperties => {
  return {
    color: goldColor,
  };
};

export const achievementLinkStyle = (): React.CSSProperties => {
  return {
    textDecorationLine: "none",
    cursor: "pointer",
    color: lightBlueColor,
  };
};

export const lastGameTitleStyle = (): React.CSSProperties => {
  return {
    color: goldColor,
    textDecorationLine: "none",
    cursor: "pointer",
  };
};

export const masteredSetsContainerStyle = (isLast: boolean): React.CSSProperties => {
  if (isLast) {
    return {};
  }
  return {
    marginBottom: "5px",
  };
};

export const footerStyle = (): React.CSSProperties => {
  return {
    fontSize: "calc(7px + 1vmin)",
    marginTop: "5px",
  };
};

export const linkStyle = (): React.CSSProperties => {
  return {
    color: goldColor,
    textDecorationLine: "none",
    cursor: "pointer",
  };
};

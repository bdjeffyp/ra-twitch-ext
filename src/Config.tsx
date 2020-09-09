import * as React from "react";

export interface IConfigProps {
  username: string;
  apiKey: string;
  handleNameUpdate: (username: string) => void;
  handleKeyUpdate: (apiKey: string) => void;
}
interface IConfigState {
  username: string;
  apiKey: string;
}

enum Fields {
  username = "username",
  apiKey = "apiKey",
}

export class Config extends React.Component<IConfigProps, IConfigState> {
  constructor(props: IConfigProps) {
    super(props);
    this.state = {
      username: "",
      apiKey: "",
    }
  }

  public render() {
    // TODO: STYLING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return (
      <div>
        <label htmlFor={Fields.username}>Retro Achievements Username: </label>
        <input id={Fields.username} type="text" name={Fields.username} onChange={this._onInputChange} />
        <br />
        <label htmlFor={Fields.apiKey}>Retro Achievements API Key: </label>
        <input id={Fields.apiKey} type="text" name={Fields.apiKey} onChange={this._onInputChange} />
        <br />
      </div>
    );
  }

  private _onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;

    if (name === Fields.username) {
      this.setState({ username: target.value });
    } else {
      this.setState({ apiKey: target.value });
    }
  }
}

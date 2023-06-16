import React, { Component, Fragment } from "react";

interface DropdownState {
  active: boolean;
}
interface DropdownProps<T> {
  options: T[];
  callback: (value: T) => void;
  current: T;
  display: (value: T) => string;
}

class Dropdown<T> extends Component<DropdownProps<T>, DropdownState> {
  state: DropdownState = { active: false };

  render() {
    const { options, callback, current, display } = this.props;
    return (
      <Fragment>
        <div className={"dropdown" + (this.state.active ? " is-active" : "")}>
          <div className="dropdown-trigger">
            <button
              className="button"
              style={{ minWidth: "73px" }}
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              onClick={() => this.setState({ active: !this.state.active })}
            >
              <span>{display(current)}</span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {options.map((value) => (
                <a
                  onClick={() => {
                    this.setState({ active: false });
                    callback(value);
                  }}
                  className="dropdown-item"
                  key={value.toString()}
                >
                  {display(value)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Dropdown;

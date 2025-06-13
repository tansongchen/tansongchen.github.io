import React, { Component, Fragment, useState } from "react";

interface DropdownProps<T> {
  options: T[];
  callback: (value: T) => void;
  current: T;
  display: (value: T) => string;
}

function Dropdown<T>({
  options,
  callback,
  current,
  display,
}: DropdownProps<T>) {
  const [active, setActive] = useState(false);
  return (
    <div className={"level-item dropdown" + (active ? " is-active" : "")}>
      <div className="dropdown-trigger">
        <button
          className="button"
          style={{ minWidth: "73px" }}
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setActive(!active)}
        >
          <span>{display(current)}</span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu">
        <div className="dropdown-content">
          {options.map((value) => (
            <a
              onClick={() => {
                setActive(false);
                callback(value);
              }}
              className="dropdown-item"
              key={(value as any).toString()}
            >
              {display(value)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dropdown;

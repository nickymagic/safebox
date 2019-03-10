import React, { Component } from 'react';
import style from './App.css';

import Bootstrap from './utils/Bootstrap';
import RobotoMono from './utils/RobotoMono';

class App extends Component {
  buttonRows = [
    ["7","8","9"],
    ["4","5","6"],
    ["1","2","3"],
    ["*","0","L"],
  ];
  render() {
    return (
      <div className={`${bootstrap.windowStyle}`}>
        <RobotoMono/>
        <Bootstrap/>
        <div className={`cPanelBox ${bootstrap.cPanelBoxStyle}`}>
          <div className={`screenBox ${bootstrap.screenBoxStyle}`}>
            <p>Unlocked</p>
            <p className={`${bootstrap.statusMessageStyle}`}>Ready</p>
          </div>
          <div>
            {
              this.buttonRows.map(row => {
                return (
                  <div className={`${bootstrap.buttonRowStyle}`}>
                    {row.map(btn => {
                      return <div className={`button ${bootstrap.buttonStyle}`}>{btn}</div>
                    })}
                  </div>
              )})
            }
          </div>
        </div>
      </div>
    );
  }
}

const bootstrap = {
  windowStyle: "vh-100 d-flex justify-content-center align-items-center",
  cPanelBoxStyle: "d-flex flex-column align-items-center",
  screenBoxStyle: "d-flex flex-column justify-content-between my-4 p-2 rounded",
  statusMessageStyle: "mb-0 mr-1 align-self-end h1",
  buttonRowStyle: "d-flex flex-row",
  buttonStyle: "d-flex justify-content-center align-items-center m-2",
}

export default App;

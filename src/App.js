import React, { Component } from 'react';
import style from './App.css';

import Bootstrap from './utils/Bootstrap';
import RobotoMono from './utils/RobotoMono';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locked: false,
      statusMessage: "",
    };
  }

  serialNumber = "12344235";
  password = "";
  buttonCombination = [];
  timeoutID = null;
  buttonRows = [
    ["7","8","9"],
    ["4","5","6"],
    ["1","2","3"],
    ["*","0","L"],
  ];

  pressButton(value) {
    if(this.isInputBlocked()) {
      return;
    }
    if(value === "L" && this.state.statusMessage === "Ready") {
      this.lock();
      return;
    }
    this.setState({statusMessage: ""});
    this.buttonCombination.push(value);
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {this.submitCombination()},1000);
  }

  submitCombination() {
    if(!this.state.locked){
      if(this.buttonCombination.length < 6){ // Submited password has invalid length
        this.setState({statusMessage: "Error"});
      }
      else{ // Submited password has valid length
        this.password = this.buttonCombination.join('');
        if(isNaN(this.password)){ // Submited password has non digits
          console.log("Invalid pass");
          this.setState({statusMessage: "Error"});
        }
        else{ // Submited password is valid
          this.setState({statusMessage: "Ready"});
        }
      }
      this.buttonCombination = [];
    }
    if(this.state.locked){
      console.log(this.buttonCombination);
      let triedPassword = this.buttonCombination.join('');
      if(triedPassword === this.password){
        this.unlock();
      }
      else{
        this.setState({statusMessage: "Error"});
      }
      this.buttonCombination = [];
    }
  }

  lock() {
    this.setState({statusMessage: "Locking"});
    setTimeout(() => {this.finishMechanicalProcess()},3000);
  }

  unlock() {
    this.setState({statusMessage: "Unlocking"});
    setTimeout(() => {this.finishMechanicalProcess()},3000);
  }

  finishMechanicalProcess() {
    this.setState({statusMessage: ""});
    this.setState({locked: !this.state.locked});
  }

  isInputBlocked() {
    if(this.buttonCombination.length > 5) {
      return true;
    }
    if(this.state.statusMessage === "Locking") {
      return true;
    }
    if(this.state.statusMessage === "Unlocking") {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className={`${bootstrap.windowStyle}`}>
        <RobotoMono/>
        <Bootstrap/>
        <div className={`cPanelBox ${bootstrap.cPanelBoxStyle}`}>
          <div className={`screenBox ${bootstrap.screenBoxStyle}`}>
            <p>{this.state.locked ? "Locked" : "Unlocked"}</p>
            <p className={`${bootstrap.statusMessageStyle}`}>{this.state.statusMessage}</p>
          </div>
          <div>
            {
              this.buttonRows.map(row => {
                return (
                  <div className={`${bootstrap.buttonRowStyle}`}>
                    {row.map(btn => {
                      return <div className={`button ${bootstrap.buttonStyle}`} onClick={() => {this.pressButton(btn)}}>{btn}</div>
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

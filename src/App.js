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

  serialNumber = 12344235;
  password = "";
  buttonCombination = [];
  timeoutID = null;
  buttonRows = [
    ["7","8","9"],
    ["4","5","6"],
    ["1","2","3"],
    ["*","0","L"],
  ];

  masterUnlock(secretKey) {
    return new Promise((resolve,reject) => {
      let api = "https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?code=" + secretKey;
      console.log(api);
      fetch(api,{
        // mode: 'no-cors',
      })
        .then(data => {
          console.log(data);
          resolve(data);
        })
        .catch(error => {
          console.log(error);
          reject();
        });
    });
  }

  pressButton(value) {
    if(this.isInputBlocked()) {
      return;
    }
    if(value === "L" && this.state.statusMessage === "Ready") {
      this.lock();
      return;
    }
    if(!(this.state.statusMessage === "Service")){
      this.setState({statusMessage: ""});
    }
    this.buttonCombination.push(value);
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {this.submitCombination()},1000);
  }

  async submitCombination() {
    if(this.state.statusMessage === "Service"){
      let secretKey = this.buttonCombination.join('');
      this.setState({statusMessage: "Validating"});
      try{
        let response = await this.masterUnlock(secretKey);
        if(response.sn === this.serialNumber){
          this.unlock(true);
        }
        else{
          this.setState({statusMessage: "Error"});
        }
      }
      catch(e){
        this.setState({statusMessage: "Error"});
      }
      this.buttonCombination = [];
      return;
    }
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
      let triedPassword = this.buttonCombination.join('');
      if(triedPassword === this.password){
        this.unlock(false);
      }
      else{
        if(triedPassword === "000000"){
          this.setState({statusMessage: "Service"});
        }
        else{
          this.setState({statusMessage: "Error"});
        }
      }
      this.buttonCombination = [];
    }
  }

  lock() {
    this.setState({statusMessage: "Locking"});
    setTimeout(() => {this.finishMechanicalProcess()},3000);
  }

  unlock(isMasterUnlock) {
    this.setState({statusMessage: "Unlocking"});
    setTimeout(() => {this.finishMechanicalProcess(isMasterUnlock)},3000);
  }

  finishMechanicalProcess(isMasterUnlock) {
    if(this.state.locked){
      if(isMasterUnlock){
        this.setState({statusMessage: ""});
      }
      else{
        this.setState({statusMessage: "Ready"});
      }
    }
    else{
      this.setState({statusMessage: ""});
    }
    this.setState({locked: !this.state.locked});
  }

  isInputBlocked() {
    if(this.buttonCombination.length > 5 && !this.state.statusMessage === "Service") {
      return true;
    }
    if(this.state.statusMessage === "Locking") {
      return true;
    }
    if(this.state.statusMessage === "Unlocking") {
      return true;
    }
    if(this.state.statusMessage === "Validating") {
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
          <div className={`${bootstrap.serialNumberStyle}`}>
            <small>S/N: {this.serialNumber}</small>
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
  serialNumberStyle: "align-self-end mr-1",
}

export default App;

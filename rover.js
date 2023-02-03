const Command = require('./command.js');
const Message = require('./message.js');


class Rover {
  constructor(position) {
    this.position = position;
    this.mode = 'NORMAL';
    this.generatorWatts = 110;
   };
    
  receiveMessage(message) {
    
    let roverStatus = {
      mode: this.mode,
      position: this.position,
      generatorWatts: this.generatorWatts
    };
    
    let commandSet = [];
    let powerSwitch = [true];

    for (let p = 0; p < message.commands.length; p++) {
      if (message.commands[p]["commandType"] === 'MODE_CHANGE' && message.commands[p]["value"] === 'LOW_POWER') {
        powerSwitch[0] = false;
        roverStatus.mode = 'LOW_POWER';
        commandSet.push({completed: true});
      } else if (message.commands[p]["commandType"] === 'MODE_CHANGE' && message.commands[p]["value"] === 'NORMAL') {
        powerSwitch[0] = true;
        roverStatus.mode = this.mode;
        commandSet.push({completed: true});
      }
    };

    //console.log(powerSwitch);    

    for (let m = 0; m < message.commands.length; m++) {
        if (message.commands[m].commandType === 'MOVE' && powerSwitch[0] === false) {
          commandSet.push({completed: false});
          } else if (message.commands[m].commandType === 'MOVE') {
            commandSet.push({completed: true, position: this.position});
            }
    };
    

    for (let p = 0; p < message.commands.length; p++) {
      if (message.commands[p]["commandType"] === 'STATUS_CHECK') {
        commandSet.push({completed: true, roverStatus: {mode: this.mode, position: this.position, generatorWatts: this.generatorWatts}});
      } 
    };
  
    //console.log(roverStatus);
    
    let response = {
      message: message.name,
      results: commandSet
    };
   //console.log(response);
    return response;
  }

}

module.exports = Rover;




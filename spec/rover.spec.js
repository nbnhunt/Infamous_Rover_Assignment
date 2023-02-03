const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function() {
    let testRover = new Rover(1);
    expect(testRover.position).toEqual(1);
    expect(testRover.mode).toEqual('NORMAL');
    expect(testRover.generatorWatts).toEqual(110);
  });

  it("response returned by receiveMessage contains name of message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('name of message', commands);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message).message).toEqual(message.name);
  });

  it('response returned by receiveMessage includes two results if two commands are sent in the message', function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message).results.length).toEqual(2);
  });

  it("responds correctly to status check command", function() {
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Test Status Check', commands);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message).results).toEqual([ Object({ completed: true, roverStatus: Object({ mode: 'NORMAL', position: 98382, generatorWatts: 110 }) }) ]);
  });

  it("responds correctly to mode change command", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Switch to Low Power', commands);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message).results).toEqual([{completed: true}]);
  });

  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE')];
    let message = new Message('Move to next crater', commands);
    let rover = new Rover(98382);
    expect(rover.receiveMessage(message).results).toEqual([{completed: true}, {completed: false}]);
  });

  it("responds with position for move command", function() {
    let commands = [new Command('MOVE', 'NORMAL')];
    let message = new Message('Move to next crater', commands);
    let rover = new Rover(90210);
    expect(rover.receiveMessage(message).results).toEqual([({ completed: true, position: 90210 })])
  });

});

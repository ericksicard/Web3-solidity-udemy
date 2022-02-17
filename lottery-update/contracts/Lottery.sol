// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;
 
contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .001 ether);  //require() is a validation function
        players.push(payable(msg.sender));
    }

    //Helper function to generete a pseudo random number
    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public onlyManager {
        //require(msg.sender == manager); //Assuring that the manager is the only one authorized to call this function

        uint index = random() % players.length; //randomly selecting the index of the winner
        players[index].transfer(address(this).balance); //transfering the money to the winner
        players = new address payable[](0); //Resetting lottery by emptying the list of player creating a new dynamic array of size zero
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}

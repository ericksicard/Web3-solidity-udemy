// SPDX-License-Identifier: MIT
 
pragma solidity ^0.4.17;
 
contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .001 ether);  //require() is a validation function
        players.push(msg.sender);
    }

    //Helper function to generete a pseudo random number
    function random() private view returns (uint){
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public onlyManager {
        //require(msg.sender == manager); //Assuring that the manager is the only one authorized to call this function

        uint index = random() % players.length; //randomly selecting the index of the winner
        players[index].transfer(this.balance); //transfering the money to the winner
        players = new address[](0); //Resetting lottery by emptying the list of player creating a new dynamic array of size zero
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }
}

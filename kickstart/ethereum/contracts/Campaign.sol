// SPDX-License-Identifier: MIT
 
pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender); //creates a new contract that gets deployed to the blockchain and returns the address of the contract
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}
 
contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals; //to keep track of the person who has voted
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    
    function createRequest( string description, uint value, address recipient) 
    public restricted {
        //"memory" allows newRequest to create a copy of "Request", populate it and 
        // push it into "requests"
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push( newRequest );                
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]); //This person has contributed to the campaign
        require(!request.approvals[msg.sender]); //This person has NOT voted for this request yet.

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2)); //The request has to br approved for more that the 50% of contributors
        require(!request.complete); //Making sure that the request has not been previously completed
        request.recipient.transfer(request.value); //Sending the money to the provider
        request.complete = true; //Marking the request as completed

    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    } 

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }    
}

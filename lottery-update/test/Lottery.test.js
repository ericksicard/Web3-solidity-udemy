const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let lottery;
let accounts;

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows new player to enter', async () => {

        //Entering a new player using the first account provided by web3.eth
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.0011', 'ether')
        });

        //Getting the player account
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        //Asserting that the address used to enter the new player is the same retrieved using getPlayer method
        assert.equal(accounts[0], players[0]);
        //Asserting that the player's array length is right
        assert.equal(1, players.length);
    });

    it('allows multiple players to enter', async () => {

        //Entering a new player using the first account provided by web3.eth
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.0011', 'ether')
        });
        //Entering a new player using the second account provided by web3.eth
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.0011', 'ether')
        });
        //Entering a new player using the third account provided by web3.eth
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.0011', 'ether')
        });
        
        //Getting the player account
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        //Asserting that the address used to enter the new player is the same retrieved using getPlayer method
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        //Asserting that the player's array length is right
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {

        //Entering a new player using the first account provided by web3.eth
        //and less money that required to participate in the lottery
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.0001', 'ether')
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        //We call pickWinner function from a different account than the used at beforeEach
        //to deploy the contract (account[0]), which is assigned to the manager by default
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('sends money to the winner and resets players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({ from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));

        //Getting the player account
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(0, players.length);
    });

});
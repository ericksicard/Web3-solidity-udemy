const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json');
const { isTypedArray } = require('util/types');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();

    //Creating a JS representation of the Factory contract created
    factory = await new web3.eth.Contract( JSON.parse(compiledFactory.interface) )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

    //Using the Factory contract to create new Campaign contracts
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas:'1000000'
    });

    //Getting the address of the last Campaign contract created
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); 

    //Creating a JS representation of the Campaign contract created
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal( accounts[0], manager )
    });
    
    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]);
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false)
        } catch (error) {
            assert(error)
        }     
    });

    it('allows a manager to make a payment request', async () =>{
        await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.description);
    });

    it('processes request', async () => {
        //Contribute to the campaign
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        //Creates a request to send money to a provider
        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        //An approver approves the request
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        //The manager finalizes the request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        //Getting the balance of the provider being paid
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.toWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > 104);
    });
});
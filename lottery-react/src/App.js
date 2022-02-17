import "./App.css";
import React, { useState, useEffect } from "react";
import lottery from './lottery';
import web3 from "./web3";

/* 
class App extends Component {

  constructor(props) {
    super(props);

    this.state = { manager: ''};
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    this.setState({ manager })
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
      </div>
    );
  }
}
*/

const App = () => {

  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [enteredAmount, setAmount] = useState('');
  const [message, setMessage] = useState('')

  useEffect( () => {
    
    // declare the async data fetching function
    const fetchContractData = async () => {
      
      // get the data from the contract
       const mngr = await lottery.methods.manager().call();
       const plyrs = await lottery.methods.getPlayers().call();
       const blnc = await web3.eth.getBalance(lottery.options.address);
       
       // set state with the result
       setManager(mngr);
       setPlayers(plyrs);
       setBalance(blnc)
      };
    
    // call the function
    fetchContractData()
    // make sure to catch any error
    .catch(console.error);

  },[]);

  //Handeling the amount entered by the player
  const amountChangeHandler = event => { setAmount(event.target.value) }

  //Passing the player information to the contract
  const submitHandler = async event => {
    event.preventDefault();

    //List of accounts
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(enteredAmount, 'ether')
    });

    setMessage('You have entered!');
  };

  //Picking a winner
  const handleWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    
    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage('A winner has been picked!');
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!</p>
      <hr/>

      <form onSubmit={ submitHandler }>
        <h4>Want to rty your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            type='number'
            value={ enteredAmount }
            onChange={ amountChangeHandler }
          />
        </div>
        <button>Enter</button>
      </form>
      <hr/>

      <h4>Ready to pick a winner?</h4>
      <button onClick={ handleWinner }>Pick a winner!</button>

      <hr/>

      <h1>{message}</h1>
    </div>
  );
};

export default App;

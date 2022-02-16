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

  useEffect( () => {
    
    // declare the async data fetching function
    const fetchManager = async () => {
      
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
    fetchManager()
    // make sure to catch any error
    .catch(console.error);
    
  },[]);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!</p>
    </div>
  );
};

export default App;

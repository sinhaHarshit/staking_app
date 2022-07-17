import logo from './logo.svg';
import Web3 from 'web3';
import TetherToken from './build/Tether.json'; 
import DummyToken from './build/Token.json';
import StakingDapp from './build/Staking_Dapp.json';
import React, { Component } from 'react';
import './App.css';

//Main app class. Contains all content and state changes.
class DApp extends Component {

  async componentWillMount() {
    await this.loadWeb3() //predefined function to load web3
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    //setState tells react to rerender the component as the set of the component has changed
    this.setState({account : accounts[0]}) 

    const networkId = await web3.eth.net.getId()

    const TetherTokenData = await TetherToken.networks[networkId]
    if(TetherTokenData) {
      const tetherToken = new web3.eth.Contracts(TetherToken.abi, TetherTokenData.address)
      this.setState({tetherToken})

      let tetherTokenBalance = await tetherToken.balance(this.state.account).call()
      this.setState({tetherTokenBalance : tetherTokenBalance.toString()})
    }

    const DummyTokenData = await DummyToken.networks[networkId]
    if(DummyTokenData) {
      const dummyToken = new web3.eth.Contracts(DummyToken.abi, DummyTokenData.address)
      this.setState({dummyToken})

      let dummyTokenBalance = await dummyToken.balance(this.state.account).call()
      this.setState({dummyTokenBalance : dummyTokenBalance.toString()})
    }

    const StakingDappData = await StakingDapp.networks[networkId]
    if(StakingDappData) {
      const stakingDapp = new web3.eth.Contracts(StakingDapp.abi, StakingDappData.address)
      this.setState({stakingDapp})

      let stakingDappBalance = await stakingDapp.stakingBalance(this.state.account).call()
      this.setState({stakingDappBalance : stakingDappBalance.toString()})
    }

  }

  //connecting we3 and metamask to dapp
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  stakeTokens = (amount) => {
    this.setState({loading: true})
    this.state.tetherToken.methods.approve(this.state.stakingDapp.address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.stakingDapp.methods.stakeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({loading:false})
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({loading: true})
    this.state.stakingDapp.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({loading:false})
      })
  }


  constructor(props) {
    super(props)
    this.state = {
      account : '0x0',
      tetherToken: {},
      dummyToken: {},
      stakingDapp: {},
      tetherTokenBalance: '0',   
      dummyTokenBalance: '0',
      stakingDappBalance: '0',
      loading: true
    }
  }

  render() {
      return (<p></p>);
  }




}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

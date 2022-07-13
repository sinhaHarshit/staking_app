// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";
import "./Tether.sol";

contract Staking_Dapp{
    string public name = "Staking Dapp";
    address public owner;

    Token public dummy_token;
    Tether public tether_token;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(Token _dummyToken, Tether _tetherToken) {
        dummy_token = _dummyToken;
        tether_token = _tetherToken;
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public {
        require(_amount > 0, "Staking amount must be greater than 0.");

        tether_token.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "No staked tokens.");

        stakingBalance[msg.sender] = 0;
        isStaked[msg.sender] = false;
        tether_token.transfer(msg.sender, balance);
        
    }

    function issueToken() public{
        require(msg.sender == owner, "Only the owner can issue tokens");

        for (uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint recipientBalance = stakingBalance[recipient];

            if (recipientBalance > 0) {
                dummy_token.transfer(recipient, recipientBalance);
            }
        }
    }

}
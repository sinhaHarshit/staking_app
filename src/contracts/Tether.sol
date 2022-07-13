// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Tether{

    string public name = "dummy Tether token";
    string public symbol = "DTET";
    uint public totalSupply = 1000000000000000000000000; //1 million (plus 18 zeros)
    uint public decimal = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approve(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    mapping(address => uint) public balance;

    //track the approwed allowance of a spender for every owner
    mapping(address => mapping(address => uint)) public allowance;

    constructor(){
        balance[msg.sender] = totalSupply; //all the tokens are sent to the creator of SC
    }

    function transfer(address _to, uint _value) public returns(bool) {
          require(balance[msg.sender] >= _value, "Insufficient balance.");
          balance[msg.sender] -= _value;
          balance[_to] += _value;

          emit Transfer(msg.sender, _to, _value);
          return true;
    }

    function approve(address _spender, uint _value) public returns(bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public returns(bool) {
          require(balance[_from] >= _value, "Insufficient balance.");
          require(_value <= allowance[_from][msg.sender]);
          balance[_from] -= _value;
          balance[_to] += _value;

          emit Transfer(_from, _to, _value);
          return true;
    }


}
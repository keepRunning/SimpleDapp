pragma solidity ^0.5.3;

contract StringSaver{

    string val = "BASE VALUE";
    
    function setKey(string memory input) public {
        val = input;
    }

    function getKey() public view returns(string memory) {
        return val;
    }
}
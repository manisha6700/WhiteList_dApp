//SDPX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract Whitelist {

    //the max no of addresses which can be whitelisted 
    uint8 public maxWhitelistedAddresses;
    //keep track of num of addresses whitelisted
    uint public numAddressesWhitelisted;
    //whitelisted addresses
    mapping (address => bool) public whitelistedAddresses;


    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        //check if the user is already whitelisted
        require(!whitelistedAddresses[msg.sender],"Sender is already whitelisted");
        //check if numAddressesWhitelisted < maxWhitelistedAddresses ,else through an error
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses can't be added to the whitelist");
        //add the address which called the function to the whitelisted array
        whitelistedAddresses[msg.sender] = true;
        //increse the num of whitelisted addresses
        numAddressesWhitelisted += 1;
    }


}
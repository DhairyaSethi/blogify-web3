pragma solidity ^0.5.0;

import "./ERC721Full.sol";

interface ERC20 {
    function approve(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
}


interface CERC20 {
    function mint(uint256) external returns (uint256);
    function exchangeRateCurrent() external returns (uint256);
    function supplyRatePerBlock() external returns (uint256);
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
}


contract Subscription is ERC721Full {

    uint256 internal postId;
    ERC20 DAI;
    CERC20 cDAI;
    address _DAI_ADD = 0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735;
    address _cDAI_ADD = 0x6D7F0754FFeb405d23C51CE938289d4835bE3b14;
    
    struct user {
    string name;
    uint256[] postsById;
    bool isSubscribed;
    }
    
    mapping(address => user) users;

	constructor () ERC721Full("Subscription Token", "SUB") public {
	    DAI = ERC20 (_DAI_ADD);
	    cDAI = CERC20(_cDAI_ADD);
	} 

//	Event Subscribed (address _who);

    function newPost (address _add) public returns (uint) {
      	users[_add].postsById.push(postId);
      	return postId ++;
    }
    
    function subscribe (address _add) public payable {
        require(!users[_add].isSubscribed, "Already subscribed!" );
        _mint(_add, 0);
        users[_add].isSubscribed = true;
//        emit Subscribed(_add);        
    }

    function checkSub (address _add) public view returns (bool) {
    	return users[_add].isSubscribed;
    }

    function setName (address _who, string memory _name) public  {
    	require(bytes(users[_who].name).length !=0, "User already registered");
    	users[_who].name = _name;
    }
    
    function supplyDaiToCompound() public returns (uint) {
        DAI.approve(_cDAI_ADD, 100000000000000000); // --> 0.1 DAI
        uint mintResult = cDAI.mint(100000000000000000);
        return mintResult;
    }
    
    function supplyDaiToContract () public {
        DAI.approve(msg.sender, 100000000000000000);
        DAI.transferFrom(msg.sender, address(this), 100000000000000000);
    }
    
    
    
    

/*
    function getName(address _who) public view returns (string) {
    	return users[_who].name;
    }
    function getPostsById(address _who) public view returns (uint[]) {
    	return users[_who].postsById;
    }
*/

}
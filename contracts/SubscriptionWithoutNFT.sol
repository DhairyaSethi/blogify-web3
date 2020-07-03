/**
 *Submitted for verification at Etherscan.io on 2020-07-03
*/

pragma solidity ^0.5.0;

interface ERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}



interface CERC20 {
    function mint(uint256) external returns (uint256);
    function exchangeRateCurrent() external returns (uint256);
    function supplyRatePerBlock() external returns (uint256);
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
} 


contract SubscriptionWithoutNFT {

    uint256 internal postId;
    ERC20 DAI;
    CERC20 cDAI;
    address public _DAI_ADD = 0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa;
    address public _cDAI_ADD = 0x6D7F0754FFeb405d23C51CE938289d4835bE3b14;
    address public owner;
    
    struct user {
    string name;
    uint256[] postsById;
    bool isSubscribed;
    }
    
    mapping(address => user) users;
    mapping(address => bool) writer;
    uint public noOfWriters;

	constructor () public {
	    DAI = ERC20 (_DAI_ADD);
	    cDAI = CERC20(_cDAI_ADD);
	    owner = msg.sender;
	} 

//	Event Subscribed (address _who);

    function newPost (address _add) public returns (uint) {
      	users[_add].postsById.push(postId);
      	writer[_add] = true;
      	return postId ++;
    }
    
    function subscribe (address _add) public payable {
        require(!users[_add].isSubscribed, "Already subscribed!" );
//        _mint(_add, 0);
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
        DAI.approve(_cDAI_ADD, 1000000000000000000); // --> 1 DAI
        uint mintResult = cDAI.mint(1000000000000000000);
        return mintResult;
    }
    
    function makeWriter (address _add) public {
        require(users[_add].isSubscribed, "Not Subscribed :(");
        noOfWriters ++;
        writer[_add] = true;
    }
    
    function checkWriter (address _add) public view returns (bool) {
        return writer[_add];
    }
    
    function writerCount () public view returns (uint) {
        return noOfWriters;
    }
    
    
    function withdrawDaiFromCompound (address _add, uint256 _amountInDAI) public {
        require(writer[_add], "Not a writer");
        cDAI.redeemUnderlying(_amountInDAI);
        DAI.approve(_add, _amountInDAI);
        DAI.transfer(_add, _amountInDAI);
    }
    
    
    
   function depositEth () external payable {}
    
    function withDrawEth () external payable returns (bool){
        require(msg.sender == owner, "Only owner can call");
        (bool success, ) = msg.sender.call.value(address(this).balance)("");
        return success;
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
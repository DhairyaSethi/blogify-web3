pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract Subscription is ERC721Full {

    uint256 internal postId;

    struct user {
    string name;
    uint256[] postsById;
    bool isSubscribed;
    }
    
    mapping(address => user) users;

	constructor () ERC721Full("Subscription Token", "SUB") public {} 

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

    function setName (address _who, string _name) public  {
    	require(bytes(users[_who].name).length !=0, "User already registered");
    	users[_who].name = _name;
    } 

    function getName(address _who) public view memory returns (string) {
    	return users[_who].name;
    }
    function getPostsById(address _who) public view memory returns (uint[]) {
    	return users[_who].postsById;
    }


}
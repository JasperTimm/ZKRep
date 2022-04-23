// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract ZKRep is AccessControl {

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    event AddUser (
        address user
    );

    constructor(address oracle) {
        _setupRole(ORACLE_ROLE, oracle);
        _setupRole(OWNER_ROLE, _msgSender());
    }

    function addUser(address user) public onlyRole(OWNER_ROLE) {
        emit AddUser(user);
    }

    function userRepGreaterThan() public {

    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20 token for examples
 * @author Cliff Hall
 */
contract Fismo20 is ERC20 {

    constructor() ERC20(TOKEN_NAME, TOKEN_SYMBOL) {}

    string public constant TOKEN_NAME = "Fismo20";
    string public constant TOKEN_SYMBOL = "FUNGIBLE";

    /**
     * Mint a Sample Fungible Token
     * @param _owner the address that will own the token
     */
    function mintSample(address _owner, uint256 _amount)
    public {
        _mint(_owner, _amount);
    }

}
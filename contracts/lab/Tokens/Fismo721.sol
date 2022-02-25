// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title ERC721 token for examples
 * @author Cliff Hall
 */
contract Fismo721 is ERC721Enumerable {

    constructor() ERC721(TOKEN_NAME, TOKEN_SYMBOL) {}

    string public constant TOKEN_NAME = "Fismo721";
    string public constant TOKEN_SYMBOL = "NON_FUNGIBLE";

    /**
     * Mint a Sample NFT
     * @param _owner the address that will own the token
     */
    function mintSample(address _owner)
    public
    returns (uint256 tokenId) {
        tokenId = totalSupply();
        _mint(_owner, tokenId);
    }

}
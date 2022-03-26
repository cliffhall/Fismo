// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC165.sol";

/**
 * @title IFismoSupport
 *
 * @notice ERC-165 interface detection standard
 * The ERC-165 identifier for this interface is 0x01ffc9a7
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismoSupport {

    /**
     * @notice Query whether Fismo supports a given interface
     *
     * @param _interfaceId - the sighash of the given interface
     *
     * @return true if _interfaceId is supported
     */
    function supportsInterface(bytes4 _interfaceId) external view returns (bool);

}
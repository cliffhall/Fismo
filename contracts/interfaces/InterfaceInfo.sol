// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "../interfaces/IFismo.sol";

/**
 * @title Interface Info
 *
 * @notice Calculate / verify the interface ids supported by the project
 *
 * When you need to add a new interface and find out what its ERC165 interfaceId is,
 * Add it to this contract, and add a unit test for it, which will fail, telling you
 * the actual interface id. Then update the supported-interfaces.js file with the id
 * of the new interface. This way, should an interface change, say adding a new method,
 * the InterfaceInfoTest.js test suite will fail, reminding you to update the interface
 * id in the constants file.
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract InterfaceInfo {

    function getIFismo()
    public pure
    returns(bytes4 id) {
        id = type(IFismo).interfaceId;
    }

}
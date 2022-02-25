// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "./IFismoOperate.sol";
import "./IFismoUpdate.sol";
import "./IFismoView.sol";

/**
 * @title Supported Interfaces
 *
 * @notice Calculate / verify the interface ids supported by the project
 *
 * When you need to add or update an interface, recalculate its ERC165 interfaceId:
 *
 *  - Add a method to return the id in SupportedInterfaces.sol
 *  - If interface is new, add to supported-interfaces.js with the a placeholder id.
 *  - Add unit test for in this file, which will fail with the actual interface id.
 *  - Update supported-interfaces.js with the actual id.
 *  - Update the ERC165 comment in the interface file itself with its actual id
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract SupportedInterfaces {

    function getIFismoOperate()
    public pure
    returns(bytes4 id) {
        id = type(IFismoOperate).interfaceId;
    }

    function getIFismoUpdate()
    public pure
    returns(bytes4 id) {
        id = type(IFismoUpdate).interfaceId;
    }

    function getIFismoView()
    public pure
    returns(bytes4 id) {
        id = type(IFismoView).interfaceId;
    }

}
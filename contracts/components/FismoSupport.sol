// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoStore } from "../domain/FismoStore.sol";
import { FismoTypes } from "../domain/FismoTypes.sol";

import { IFismoClone } from "../interfaces/IFismoClone.sol";
import { IFismoOperate } from "../interfaces/IFismoOperate.sol";
import { IFismoOwner } from "../interfaces/IFismoOwner.sol";
import { IFismoSupport } from "../interfaces/IFismoSupport.sol";
import { IFismoUpdate } from "../interfaces/IFismoUpdate.sol";
import { IFismoView } from "../interfaces/IFismoView.sol";

import { FismoUpdate } from "./FismoUpdate.sol";

/**
 * @title FismoSupport
 *
 * @notice ERC-165 interface detection standard
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoSupport is IFismoSupport, FismoUpdate {

    /**
     * @notice Onboard implementation of ERC-165 interface detection standard.
     *
     * @param _interfaceId - the sighash of the given interface
     *
     * @return true if _interfaceId is supported
     */
    function supportsInterface(bytes4 _interfaceId)
    external
    view
    override
    returns (bool)
    {
        return (
        (_interfaceId == type(IFismoClone).interfaceId && getStore().isFismo) ||
        _interfaceId == type(IFismoOperate).interfaceId ||
        _interfaceId == type(IFismoOwner).interfaceId ||
        _interfaceId == type(IFismoSupport).interfaceId ||
        _interfaceId == type(IFismoUpdate).interfaceId ||
        _interfaceId == type(IFismoView).interfaceId
        ) ;
    }

}
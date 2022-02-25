// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoOperate } from  "./components/FismoOperate.sol";

/**
 * @title Fismo - Finite State Machines with a twist
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract Fismo is FismoOperate  {

    /**
     * Constructor
     *
     * Sets the initial contract owner
     *
     * @param _owner the address of the contract owner
     */
    constructor(address _owner) payable {
        setOwner( _owner);
    }

}
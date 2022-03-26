// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoClone } from  "./components/FismoClone.sol";

/**
 * @title Fismo - Finite State Machines with a twist
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract Fismo is FismoClone {

    /**
     * @notice Constructor
     *
     * Note:
     * - Deployer becomes owner
     * - Only executed in an actual contract deployment
     * - Clones have their init() method called to do same
     */
    constructor() payable {
        setOwner(msg.sender);
        setIsFismo(true);
    }

}
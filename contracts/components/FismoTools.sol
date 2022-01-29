// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";

/**
 * @title FismoTools
 *
 * @notice Fismo pure function utilities
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoTools is FismoTypes {

    /**
     * @notice Get the function signature for an enter or exit guard guard
     *
     * e.g.,
     * `NightClub_Dancefloor_Enter(address _user, string memory _priorStateName)`
     *
     * @param _machineName - the name of the machine, e.g., `NightClub`
     * @param _stateName - the name of the state, e.g., `Dancefloor`
     * @param _guard - the type of guard (enter/exit). See {FismoTypes.Guard}
     *
     * @return guardSignature - a string representation of the function signature
     */
    function getGuardSignature(string memory _machineName, string memory _stateName, FismoTypes.Guard _guard)
    internal
    pure
    returns (string memory guardSignature) {
        string memory guardType = (_guard == FismoTypes.Guard.Enter) ? "_Enter" : "_Exit";
        string memory functionName = strConcat(
            strConcat(
                strConcat(_machineName, "_"),
                _stateName
            ),
            guardType
        );

        // TODO: do I need names and types or just types for signature
        /*
                string memory functionParams = strConcat(
                    "(address _user, string memory ",
                    (_guard == Guard.Enter)
                    ? "_priorStateName)"
                    : "_nextStateName)"
                );
        */

        string memory functionParams = "(address, string)";

        guardSignature = strConcat(functionName, functionParams);
    }

    /**
     * @notice Get the function selector for an enter or exit guard guard
     *
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     * @param _guard - the type of guard (enter/exit). See {FismoTypes.Guard}
     *
     * @return guardSelector - the function selector, e.g., `0x23b872dd`
     */
    function getGuardSelector(string memory _machineName, string memory _stateName, FismoTypes.Guard _guard)
    internal
    pure
    returns (bytes4 guardSelector)
    {
        // Get the signature
        string memory guardSignature = getGuardSignature(_machineName, _stateName, _guard);

        // Return the hashed function selector
        guardSelector = nameToId(guardSignature);
    }

    /**
     * @notice Concatenate two strings
     * @param _a the first string
     * @param _b the second string
     * @return result the concatenation of `_a` and `_b`
     */
    function strConcat(string memory _a, string memory _b)
    internal
    pure
    returns(string memory result)
    {
        result = string(abi.encodePacked(bytes(_a), bytes(_b)));
    }

    /**
     * @notice Hash a name into a bytes4 id
     *
     * @param _name a string to hash
     *
     * @return id bytes4 sighash of _name
     */
    function nameToId(string memory _name)
    internal
    pure
    returns
    (bytes4 id)
    {
        id = bytes4(keccak256(bytes(_name)));
    }

}
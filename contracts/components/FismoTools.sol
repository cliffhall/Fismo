// SPDX-License-Identifier: BSD-3-Clause
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
    public
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

        // Construct signature
        guardSignature = strConcat(functionName, "(address,string)");
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

    /**
     * @notice make sure the given address has code
     *
     * Reverts if address has no contract code
     *
     * @param _contract - the contract to check
     * @param _errorMessage - the revert reason to throw
     */
    function enforceHasContractCode(address _contract, string memory _errorMessage) internal view {
        uint256 contractSize;
        assembly {
            contractSize := extcodesize(_contract)
        }
        require(contractSize > 0, _errorMessage);
    }

}
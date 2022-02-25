// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

/**
 * @title NightClubConstants
 *
 * @notice Constants used by the NightClub example
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract NightClubConstants {

    // Access Control Roles
    bytes32 internal constant ADMIN = keccak256("ADMIN");    // Deployer and any other admins as needed
    bytes32 internal constant VIP = keccak256("VIP");        // VIP clubbers get in free

    // Door Fee for the plebs
    uint256 internal constant DOOR_FEE = 0.005 ether;

    // States
    string internal constant HOME = "Home";
    string internal constant CAB = "Cab";
    string internal constant STREET = "Street";
    string internal constant FOYER = "Foyer";
    string internal constant BAR = "Bar";
    string internal constant DANCEFLOOR = "Dancefloor";
    string internal constant RESTROOM = "Restroom";
    string internal constant VIP_LOUNGE = "VIP_Lounge";

}
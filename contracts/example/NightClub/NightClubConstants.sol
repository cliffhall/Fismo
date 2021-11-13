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
    string private constant HOME = "Home";
    string private constant CAB = "Cab";
    string private constant STREET = "Street";
    string private constant FOYER = "Foyer";
    string private constant BAR = "Bar";
    string private constant DANCEFLOOR = "Dancefloor";
    string private constant RESTROOM = "Restroom";
    string private constant VIP_LOUNGE = "VIP_Lounge";

}
// Environment
const hre = require("hardhat");
const ethers = hre.ethers;
const environments = require('../../environments');
const gasLimit = environments.gasLimit;
const { expect } = require("chai");

// Scripts and data
const { deployTokens } = require("../../scripts/deploy/deploy-tokens");

/**
 * Test the Fismo lab tokens
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
describe("Test Lab Tokens", function() {

    // Common vars
    let accounts, deployer, user, owner;
    let fismo20, fismo721, fismo1155;
    let amountToMint, balance, tokenId;

    beforeEach( async function () {

        // Make accounts available
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];

        // Deploy Fismo
        [fismo20, fismo721, fismo1155] = await deployTokens(gasLimit);

    });

    context("📋 Fismo20", async function () {

        context("👉 mintSample()", async function () {

            it("Should mint and transfer an arbitrary amount of the token to the user", async function () {

                // A completely arbitrary amount
                amountToMint = "420";

                // Mint the tokens and check for the event
                await expect(fismo20.connect(user).mintSample(user.address, amountToMint))
                    .to.emit(fismo20, 'Transfer')
                    .withArgs(ethers.constants.AddressZero, user.address, amountToMint);


            });

        });

        context("👉 balanceOf()", async function () {

            it("Should report a user's expected balance of the token", async function () {

                // A completely arbitrary amount
                amountToMint = "69";

                // Mint the tokens
                await fismo20.connect(user).mintSample(user.address, amountToMint);

                // Check the user's balance
                balance = await fismo20.balanceOf(user.address);
                expect(balance).to.equal(amountToMint);

            });

        });

    });

    context("📋 Fismo721", async function () {

        context("👉 mintSample()", async function () {

            it("Should mint and transfer a token to the user", async function () {

                // The first token
                tokenId = "0";

                // Mint the next token and check for the event
                await expect(fismo721.connect(user).mintSample(user.address))
                    .to.emit(fismo721, 'Transfer')
                    .withArgs(ethers.constants.AddressZero, user.address, tokenId);


            });

        });

        context("👉 ownerOf()", async function () {

            it("Should report the correct owner of a token", async function () {

                // The first token id
                tokenId = "0";

                // Mint the next token
                await fismo721.connect(user).mintSample(user.address);

                // Check the user's balance
                owner = await fismo721.ownerOf(tokenId);
                expect(owner).to.equal(user.address);

            });

        });

    });

    context("📋 Fismo1155", async function () {

        context("👉 mintSample()", async function () {

            it("Should mint and transfer an arbitrary amount of a token to the user", async function () {

                // A completely random token id
                tokenId = "69";

                // A completely arbitrary amount
                amountToMint = "420";

                // Mint the tokens and check for the event
                await expect(fismo1155.connect(user).mintSample(user.address, tokenId, amountToMint))
                    .to.emit(fismo1155, 'TransferSingle')
                    .withArgs(user.address, ethers.constants.AddressZero, user.address, tokenId, amountToMint);

            });

        });

        context("👉 balanceOf()", async function () {

            it("Should report a user's expected balance of a token", async function () {

                // A completely random token id
                tokenId = "69";

                // A completely arbitrary amount
                amountToMint = "420";

                // Mint the tokens
                await fismo1155.connect(user).mintSample(user.address, tokenId, amountToMint);

                // Check the user's balance
                balance = await fismo1155.balanceOf(user.address, tokenId);
                expect(balance).to.equal(amountToMint);

            });

        });

    });

});
const hre = require("hardhat");

/**
 * Deployment reporting and Etherscan verification
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function deploymentComplete(name, address, args, contracts) {
    contracts.push({name, address, args});
    console.log(`✅  ${name} deployed to: ${address}`);
}

async function verifyOnEtherscan(contract) {
    console.log(`\n📋 Verifying ${contract.name}`);
    try {
        await hre.run("verify:verify", {
            address: contract.address,
            constructorArguments: contract.args,
        })
    } catch (e) {
        console.log(`❌ Failed to verify ${contract.name} on etherscan. ${e.message}`);
    }
}

exports.delay = delay;
exports.deploymentComplete = deploymentComplete;
exports.verifyOnEtherscan = verifyOnEtherscan;

const environments = require('../../environments');
const gasLimit = environments.gasLimit;
const hre = require("hardhat");
const ethers = hre.ethers;
const network = hre.network.name;
const chain = environments.network[network].chain;
const {deployFismo} = require("./deploy-fismo");
const {deployOperator} = require("./deploy-operator");
const {delay, deploymentComplete, verifyOnEtherscan} = require("./report-verify");

async function main() {

    // Deployed contracts
    let contract, contracts = [];

    // Get accounts
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];

    // Report header
    const divider = "-".repeat(80);
    console.log(`${divider}\n💥 Deploy and verify Fismo / Operator pair\n${divider}`);
    console.log(`⛓  Network: ${network} (${chain.name})\n📅 ${new Date()}`);
    console.log("🔱 Deployer account: ", deployer ? deployer.address : "not found" && process.exit() );
    console.log(divider);

    // Compile everything
    await hre.run('compile');

    // Deploy Fismo
    [fismo] = await deployFismo(gasLimit);
    deploymentComplete('Fismo', fismo.address, [], contracts);

    // Deploy basic Operator
    [operator, operatorArgs] = await deployOperator(fismo, gasLimit);
    deploymentComplete('Operator', operator.address, operatorArgs, contracts);

    console.log(`✋ Be sure to update scripts/domain/util/deployments.js`);
    console.log(`➡️ Set Deployments.${chain.name}.Fismo to "${fismo.address}"`);
    console.log(`➡️ Set Deployments.${chain.name}.Operator to "${operator.address}"`);

    // Bail now if deploying locally
    if (hre.network.name === 'hardhat') process.exit();

    // Wait a minute after deployment completes and then verify contracts on etherscan
    console.log('⏲ Pause one minute, allowing deployments to propagate to Etherscan backend...');
    await delay(60000).then(
        async () => {
            console.log('🔍 Verifying contracts on Etherscan...');
            while(contracts.length) {
                contract = contracts.shift()
                await verifyOnEtherscan(contract);
            }
        }
    );

    console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
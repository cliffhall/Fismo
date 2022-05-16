const hre = require("hardhat");
const fs = require("fs");

async function main() {

    // Sup?
    let err, target, artifact, contracts = {};
    let artifactPath = "artifacts/contracts";
    let interfacePath = artifactPath+"/interfaces";
    let sdkFile = "sdk/fismo-abi.json"

    // Compile everything (in case run by node)
    console.log(`🏭 Compiling contracts...`);
    await hre.run('compile');

    // Extract ABI
    console.log(`\n⛏  Extracting ABI for Fismo interfaces...`);

    // Folders in this path are named <filename>.sol and contain .dbg.json and .json files
    fs.readdirSync(interfacePath).forEach(folder => {

        // In each .sol folder, read the .json file and extract the abi
        if (folder.endsWith('.sol')) {
            target = `${interfacePath}/${folder}/${folder.split('.')[0]+".json"}`;
            artifact = JSON.parse(fs.readFileSync(target, "utf8"));
            contracts[artifact.contractName] = artifact.abi;
            console.log(`✅  ${artifact.contractName}`);
        }
    });

    // Get Operator contract
    console.log(`\n⛏  Extracting ABI for Operator contract...`);
    target = `${artifactPath}/Operator.sol/Operator.json`;
    artifact = JSON.parse(fs.readFileSync(target, "utf8"));
    contracts[artifact.contractName] = artifact.abi;
    console.log(`✅  ${artifact.contractName}`);

    // Flatten interface abi object to JSON
    console.log(`💾 Writing ABI to SDK...`);
    const abi = JSON.stringify(contracts);
    fs.writeFileSync(sdkFile, abi, (response) => err = response);
    console.log((err) ? `❌ ${err}` : `✅  ABI extracted!`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
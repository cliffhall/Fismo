const hre = require("hardhat");
const fs = require("fs");

async function main() {

    // Sup?
    let err, interfaces = {};
    let artifactPath = "artifacts/contracts/interfaces";
    let sdkFile = "sdk/fismo-abi.json"

    // Compile everything (in case run by node)
    console.log(`🏭 Compiling contracts...`);
    await hre.run('compile');

    // Extract ABI
    console.log(`\n⛏  Extracting ABI for Fismo interfaces...`);

    // Folders in this path are named <filename>.sol and contain .dbg.json and .json files
    fs.readdirSync(artifactPath).forEach(folder => {

        // In each .sol folder, read the .json file and extract the abi
        if (folder.endsWith('.sol')) {
            const target = `${artifactPath}/${folder}/${folder.split('.')[0]+".json"}`;
            const artifact = JSON.parse(fs.readFileSync(target, "utf8"));
            interfaces[artifact.contractName] = artifact.abi;
            console.log(`✅  ${artifact.contractName}`);
        }
    });

    // Flatten interface abi object to JSON
    console.log(`💾 Writing ABI to SDK...`);
    const abi = JSON.stringify(interfaces);
    fs.writeFileSync(sdkFile, abi, (response) => err = response);
    console.log((err) ? `❌ ${err}` : `✅  ABI extracted!`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
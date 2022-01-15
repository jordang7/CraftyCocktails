const ingredients = require("./ingredients.json");
const existingContractAddr = "0x2bAc61884d1B3aff1BB9595cE83F1DD014676E35";

async function main() {
  const nft = await hre.ethers.getContractAt(
    "IngredientNFTMarket",
    existingContractAddr
  );

  const signer0 = await ethers.provider.getSigner(0);
  const nonce = await signer0.getTransactionCount();
  let count = 0;
  for (i in ingredients) {
    const tokenURI = ingredients[i];
    console.log(tokenURI);
    await nft.mintIngredient(tokenURI, {
      nonce: nonce + count,
    });
    count++;
  }

  console.log("Minting is complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

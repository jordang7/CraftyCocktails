const ingredients = require("./ingredients.json");
const existingContractAddr = "0x8aD09BFD267a0B6b8C797ABcdc518b36C888f417";

async function main() {
  const nft = await hre.ethers.getContractAt(
    "CocktailNFTMarket",
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

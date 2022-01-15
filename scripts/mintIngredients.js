const ingredients = require("./ingredients.json");
const existingContractAddr = "0xd462ED26046E5f49889CBF101ff580082b7982fF";

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

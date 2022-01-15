async function main() {
  IngredientNFTMarket = await ethers.getContractFactory("IngredientNFTMarket");
  ingredientNFTMarket = await IngredientNFTMarket.deploy();

  await ingredientNFTMarket.deployed();

  CocktailNFT = await ethers.getContractFactory("CocktailNFT");
  cocktailNFT = await CocktailNFT.deploy(ingredientNFTMarket.address);

  await cocktailNFT.deployed();

  await ingredientNFTMarket.changeCocktailBase(cocktailNFT.address);

  console.log("ingredientNFTMarket deployed to:", ingredientNFTMarket.address);

  console.log("CocktailNFTMarket deployed to:", cocktailNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

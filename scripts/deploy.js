async function main() {
  const CocktailNFTMarket = await hre.ethers.getContractFactory(
    "CocktailNFTMarket"
  );
  const nft = await CocktailNFTMarket.deploy();

  await nft.deployed();

  console.log("CocktailNFTMarket deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

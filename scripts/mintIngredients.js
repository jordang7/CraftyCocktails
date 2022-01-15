const existingContractAddr = "0x8aD09BFD267a0B6b8C797ABcdc518b36C888f417";

async function main() {
  const nft = await hre.ethers.getContractAt(
    "CocktailNFTMarket",
    existingContractAddr
  );

  const signer0 = await ethers.provider.getSigner(0);
  // const nonce = await signer0.getTransactionCount();
  // for (let i = 0; i < friends.length; i++) {
  //   const tokenURI =
  //     "https://gateway.ipfs.io/ipfs/QmaKG6TbRtYgT8yPMo7A71qFE58FMgdKA3qvtqbwzvwTnB";
  //   await nft.awardItem(friends[i], tokenURI, {
  //     nonce: nonce + i,
  //   });
  // }

  console.log(await nft.mintIngredient("hello"));

  console.log("Minting is complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

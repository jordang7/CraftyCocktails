const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("CocktailNFTMarket", function () {
  it("Should mint two ingredients", async function () {
    signer0 = await hre.ethers.getSigner(1);
    signer1 = await hre.ethers.getSigner(2);
    const CocktailNFTMarket = await ethers.getContractFactory(
      "CocktailNFTMarket"
    );
    const cocktailNFTMarket = await CocktailNFTMarket.deploy();
    await cocktailNFTMarket.deployed();

    await cocktailNFTMarket.connect(signer0).mintIngredient("Lime.com");
    await cocktailNFTMarket.connect(signer0).mintIngredient("Tequila.com");
    items = await cocktailNFTMarket.getAllMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await cocktailNFTMarket.tokenURI(i.tokenId);
        let item = {
          tokenId: i.tokenId.toString(),
          owner: i.owner,
          tokenUri: tokenUri,
          isActive: i.isActive,
          isIngredient: i.isIngredient,
        };
        return item;
      })
    );

    //assert(items.length == 2);

    await cocktailNFTMarket
      .connect(signer0)
      .createCocktailItem([1, 2], "lazyMargarita");
    // items = await cocktailNFTMarket.getAllMarketItems();
    // items = await Promise.all(
    //   items.map(async (i) => {
    //     //const tokenUri = await cocktailNFTMarket.tokenURI(i.tokenId);
    //     let item = {
    //       tokenId: i.tokenId.toString(),
    //       owner: i.owner,
    //       //tokenUri: tokenUri,
    //       isActive: i.isActive,
    //       isIngredient: i.isIngredient,
    //     };
    //     return item;
    //   })
    // );

    // //console.log(items);
    await cocktailNFTMarket
      .connect(signer0)
      .createCocktailItem([1, 2], "lazyMargarita");
  });
});

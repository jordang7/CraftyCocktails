const { assert } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("CocktailNFTMarket", function () {
  let CocktailNFTMarket, cocktailNFTMarket;
  beforeEach(async () => {
    signer0 = await hre.ethers.getSigner(1);
    signer1 = await hre.ethers.getSigner(2);
    CocktailNFTMarket = await ethers.getContractFactory("CocktailNFTMarket");
    cocktailNFTMarket = await CocktailNFTMarket.connect(signer0).deploy();
    await cocktailNFTMarket.deployed();
  });
  it("Should mint two ingredients and buy both with signer1", async function () {
    await cocktailNFTMarket.connect(signer0).mintIngredient("Lime.com");
    await cocktailNFTMarket.connect(signer0).mintIngredient("Tequila.com");
    await cocktailNFTMarket
      .connect(signer1)
      .createMarketSale(1, { value: ethers.utils.parseUnits(".003", "ether") });
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

    // await cocktailNFTMarket
    //   .connect(signer0)
    //   .createCocktailItem([1, 2], "lazyMargarita");
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

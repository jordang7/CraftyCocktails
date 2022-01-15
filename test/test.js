const { assert, expect } = require("chai");
const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("CocktailNFTMarket", function () {
  let IngredientNFTMarket, ingredientNFTMarket, CocktailNFT, cocktailNFT;
  beforeEach(async () => {
    signer0 = await hre.ethers.getSigner(1);
    signer1 = await hre.ethers.getSigner(2);
    IngredientNFTMarket = await ethers.getContractFactory(
      "IngredientNFTMarket"
    );
    ingredientNFTMarket = await IngredientNFTMarket.connect(signer0).deploy();
    await ingredientNFTMarket.deployed();

    CocktailNFT = await ethers.getContractFactory("CocktailNFT");
    cocktailNFT = await CocktailNFT.connect(signer0).deploy(
      ingredientNFTMarket.address
    );

    await cocktailNFT.deployed;

    const success = await ingredientNFTMarket
      .connect(signer0)
      .changeCocktailBase(cocktailNFT.address);
  });
  it("Should mint two ingredients and buy both with signer1", async function () {
    await ingredientNFTMarket.connect(signer0).mintIngredient("Lime.com");
    await ingredientNFTMarket.connect(signer0).mintIngredient("Tequila.com");
    await ingredientNFTMarket
      .connect(signer1)
      .createMarketSale(1, { value: ethers.utils.parseUnits(".003", "ether") });
    await ingredientNFTMarket
      .connect(signer1)
      .createMarketSale(2, { value: ethers.utils.parseUnits(".003", "ether") });
    items = await ingredientNFTMarket.getAllMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await ingredientNFTMarket.tokenURI(i.tokenId);
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
    console.log(items);
    //assert();

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
    expect(
      await ingredientNFTMarket
        .connect(signer0)
        .createCocktailItem([1, 2], "lazyMargarita")
    ).to.emit(cocktailNFT, "CocktailCreated");
  });
});

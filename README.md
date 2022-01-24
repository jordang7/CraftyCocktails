# An NFT marketplace allowing users to buy one-use ingredient NFTs and “combine” them by crafting their own cocktail NFT
- Ethglobal NFTHack submission
- Built off of Moralis ethereum boilerplate

# Setup
Install dependencies in the top-level directory with npm install.

Create .env file with following variables
 - REACT_APP_MORALIS_APPLICATION_ID = 
 - REACT_APP_MORALIS_SERVER_URL =
 - REACT_APP_MARKET_ADDRESS = 
 - REACT_APP_COCKTAIL_ADDRESS =
 - PRIVATE_KEY=
 - RINKEBY_URL=

Compile and deploy contracts using the deploy.js script `npx hardhat run scripts/deploy.js`

Mint ingredient NFTs for users to purchase by calling mintIngredients.js `npx hardhat run scripts/mintIngredients.js`

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CocktailNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddr;

    event CocktailCreated(uint256);

    constructor(address _addr) ERC721("Cocktail", "CTR") {
        contractAddr = _addr;
    }

    function createCocktail(string memory _tokenURI, address creator) public {
        require(msg.sender == contractAddr);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(creator, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        emit CocktailCreated(newItemId);
    }
}

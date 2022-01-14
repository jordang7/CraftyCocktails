// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract CocktailNFTMarket is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address payable owner;

    struct MarketItem {
        uint256 tokenId;
        address owner;
        bool isIngredient; // if false its a cocktail
        bool isActive; // if false its burned and cannot be used or seen
    }

    event MarketItemCreated(uint256 tokenId, address owner);
    mapping(uint256 => MarketItem) private idToMarketItem;

    constructor() ERC721("Cocktails", "CT") {
        owner = payable(msg.sender);
    }

    function mintIngredient(string memory _tokenURI) external {
        // require(owner == msg.sender);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        idToMarketItem[newItemId] = MarketItem(
            newItemId,
            payable(msg.sender),
            true,
            true
        );
    }

    function createCocktailItem(uint256[] memory ids, string memory _tokenURI)
        external
    {
        bool allow = true;
        for (uint256 i = 0; i < ids.length; i++) {
            if (
                !idToMarketItem[ids[i]].isIngredient ||
                !idToMarketItem[ids[i]].isActive
            ) {
                allow = false;
            }
        }
        console.log(allow);
        require(allow, "ingredients cannot be used twice");

        for (uint256 i = 0; i < ids.length; i++) {
            _burn(ids[i]);
            idToMarketItem[ids[i]].isActive = false;
        }

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        idToMarketItem[newItemId] = MarketItem(
            newItemId,
            payable(msg.sender),
            false,
            true
        );

        emit MarketItemCreated(newItemId, payable(msg.sender));
    }

    function getAllMarketItems() external view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 curr = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            itemCount++;
        }
        MarketItem[] memory marketItems = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            uint256 currentId = i + 1;
            MarketItem storage currentItem = idToMarketItem[currentId];
            marketItems[curr] = currentItem;
            curr++;
        }

        return marketItems;
    }

    // function getMarketItemsByUser()
    //     external
    //     view
    //     returns (MarketItem[] memory, int256)
    // {
    //     uint256 totalItemCount = _tokenIds.current();
    //     uint256 itemCount = 0;
    //     uint256 curr = 0;
    //     int256 karma = 0;

    //     for (uint256 i = 0; i < totalItemCount; i++) {
    //         if (
    //             idToMarketItem[i + 1].chef == msg.sender &&
    //             !idToMarketItem[i + 1].isReward
    //         ) {
    //             itemCount++;
    //         }
    //     }

    //     MarketItem[] memory marketItems = new MarketItem[](itemCount);

    //     for (uint256 i = 0; i < totalItemCount; i++) {
    //         if (
    //             idToMarketItem[i + 1].chef == msg.sender &&
    //             !idToMarketItem[i + 1].isReward
    //         ) {
    //             MarketItem storage currentItem = idToMarketItem[i + 1];
    //             marketItems[curr] = currentItem;
    //             karma += (currentItem.upCount - currentItem.downCount);
    //             curr++;
    //         }
    //     }
    //     return (marketItems, karma);
    // }
}

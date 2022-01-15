// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./CocktailNFT.sol";
import "hardhat/console.sol";

contract CocktailNFTMarket is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    address payable owner;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isIngredient; // if false its a cocktail
        bool isActive; // if false its burned and cannot be used or seen
        bool isSold;
    }
    event MarketItemSold(uint256 indexed itemId, address owner);
    event MarketItemCreated(
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price,
        bool isIngredient,
        bool isSold
    );
    mapping(uint256 => MarketItem) private idToMarketItem;

    constructor() ERC721("Cocktails", "CT") {
        owner = payable(msg.sender);
    }

    // fallback function
    receive() external payable {}

    function mintIngredient(string memory _tokenURI) external {
        // require(owner == msg.sender);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(address(this), newItemId);
        _setTokenURI(newItemId, _tokenURI);
        idToMarketItem[newItemId] = MarketItem(
            newItemId,
            payable(address(this)),
            payable(address(0)),
            .003 ether,
            true,
            true,
            false
        );

        emit MarketItemCreated(
            newItemId,
            payable(address(this)),
            payable(address(0)),
            .003 ether,
            true,
            false
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
            payable(address(this)),
            payable(msg.sender),
            0,
            false,
            true,
            false
        );

        emit MarketItemCreated(
            newItemId,
            payable(address(this)),
            payable(msg.sender),
            0,
            false,
            false
        );
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

    function createMarketSale(uint256 itemId) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        bool sold = idToMarketItem[itemId].isSold;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        require(sold != true, "This Sale has alredy finished");
        emit MarketItemSold(itemId, msg.sender);
        console.log(idToMarketItem[itemId].seller);
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold.increment();
        idToMarketItem[itemId].isSold = true;
    }
}

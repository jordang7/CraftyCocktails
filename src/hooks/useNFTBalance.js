import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTBalance = (addr) => {
  const { account } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [NFTBalance, setNFTBalance] = useState([]);
  const {
    fetch: getNFTBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTs, {
    chain: chainId,
    address: addr,
  });
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(async () => {
    if (data?.result) {
      const NFTs = data.result;
      setFetchSuccess(true);
      for (let NFT of NFTs) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          NFT.image = resolveLink(NFT.metadata?.image);
        } else if (NFT?.token_uri) {
          try {
            //console.log(NFT.token_uri);
            await fetch(NFT.token_uri)
              .then((response) => response.json())
              .then((data) => {
                //console.log(data);
                NFT.image = resolveLink(data.image);
              });
          } catch (error) {
            //console.log(NFT, error);
            setFetchSuccess(false);
          }
        }
      }
      setNFTBalance(NFTs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getNFTBalance, NFTBalance, fetchSuccess, error, isLoading };
};

# nUSD Stablecoin

The task for assessment is to create a new stablecoin called nUSD. The stablecoin will be backed by ETH (similar to DAI).
The primary goals of this project are to allow users to deposit ETH and receive 50% of its value in nUSD.
Additionally, there will be a redeem function to convert nUSD back into either ETH.

Key Functions:

- Develop a function that enables users to deposit ETH and receive 50% of its value in nUSD. For instance, if a user deposits 1 ETH at 2000, they should receive 1000 nUSD. Applicants can use Testnet Ether and Testnet Chainlink Oracle for this task.
- Design a redeem function that allows users to convert their nUSD back into either ETH at the current exchange. Ensure that the amount of nUSD required to convert to ETH is double the value, that is, to convert nUSD to 1ETH at 2000, 4000 nUSD would be required.
- Ensure that the total supply of nUSD is updated based on the actions.

### Depoyed

- [DSC Engine](https://sepolia.etherscan.io/address/0x2e344024b6fa28646bdace18c259525fb179b29a)
- [nUSD Stable Coin](https://sepolia.etherscan.io/address/0xfaaad54447612ae63c5f60140be9fd7d961e57a1)
- [OracleLib](https://sepolia.etherscan.io/address/0xc69fe4cee0a65255fbffd0956beb2ad86a3d4508)

`forge coverage`<br />
<img width="836" alt="image" src="https://github.com/smrnjeet222/nUSD-stablecoin/assets/48654626/f10423f8-f305-4216-9e67-b70aaf304632">

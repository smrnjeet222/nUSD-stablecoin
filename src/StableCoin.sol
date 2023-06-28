// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20Burnable, ERC20} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Decentralized Stable Coin
 * @author Simranjeet Singh
 * Collateral: Exogenous
 * Minting (Stability Mechanism): Decentralized (Algorithmic)
 * Value (Relative Stability): Anchored (Pegged to USD)
 * Collateral Type: Crypto
 *
 * This is the contract meant to be owned by DSCEngine. It is a ERC20 token that can be minted and burned by the DSCEngine smart contract.
 */
contract StableCoin is ERC20Burnable, Ownable {
    error AmountMustBeMoreThanZero();
    error BurnAmountExceedsBalance();
    error NotZeroAddress();

    constructor() ERC20("Unreal USD", "nUSD") {}

    function burn(uint256 _amount) public override onlyOwner {
        uint256 balance = balanceOf(msg.sender);
        if (_amount <= 0) {
            revert AmountMustBeMoreThanZero();
        }
        if (balance < _amount) {
            revert BurnAmountExceedsBalance();
        }
        super.burn(_amount);
    }

    function mint(address _to, uint256 _amount) external onlyOwner returns (bool) {
        if (_to == address(0)) {
            revert NotZeroAddress();
        }
        if (_amount <= 0) {
            revert AmountMustBeMoreThanZero();
        }
        _mint(_to, _amount);
        return true;
    }
}

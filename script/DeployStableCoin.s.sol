// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {StableCoin} from "@/src/StableCoin.sol";
import {DSCEngine} from "@/src/DSCEngine.sol";

contract DeployStableCoin is Script {
    address[] public tokenAddresses;
    address[] public priceFeedAddresses;

    function run() external returns (StableCoin, DSCEngine, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig();
        (address wethUsdPriceFeed, address weth, uint256 deployerKey) = helperConfig.activeNetworkConfig();

        tokenAddresses = [weth];
        priceFeedAddresses = [wethUsdPriceFeed];

        vm.startBroadcast(deployerKey);

        StableCoin nUSD = new StableCoin();

        DSCEngine dscEngine = new DSCEngine(
            tokenAddresses,
            priceFeedAddresses,
            address(nUSD)
        );
        nUSD.transferOwnership(address(dscEngine));

        vm.stopBroadcast();
        return (nUSD, dscEngine, helperConfig);
    }
}

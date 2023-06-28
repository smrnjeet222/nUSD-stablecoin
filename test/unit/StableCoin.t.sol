// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {StableCoin} from "@/src/StableCoin.sol";
import {Test, console} from "forge-std/Test.sol";
import {StdCheats} from "forge-std/StdCheats.sol";

contract StableCoinTest is StdCheats, Test {
    StableCoin nUSD;

    function setUp() public {
        nUSD = new StableCoin();
    }

    function testMustMintMoreThanZero() public {
        vm.prank(nUSD.owner());
        vm.expectRevert();
        nUSD.mint(address(this), 0);
    }

    function testMustBurnMoreThanZero() public {
        vm.startPrank(nUSD.owner());
        nUSD.mint(address(this), 100);
        vm.expectRevert();
        nUSD.burn(0);
        vm.stopPrank();
    }

    function testCantBurnMoreThanYouHave() public {
        vm.startPrank(nUSD.owner());
        nUSD.mint(address(this), 100);
        vm.expectRevert();
        nUSD.burn(101);
        vm.stopPrank();
    }

    function testCantMintToZeroAddress() public {
        vm.startPrank(nUSD.owner());
        vm.expectRevert();
        nUSD.mint(address(0), 100);
        vm.stopPrank();
    }
}
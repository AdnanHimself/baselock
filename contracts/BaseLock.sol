// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BaseLock
 * @dev Simple payment router for token-gated links on Base L2.
 *      It emits events that the off-chain API can verify.
 */
contract BaseLock {
    // Event emitted when a user pays to unlock a link
    event Paid(address indexed payer, address indexed receiver, string indexed linkId, uint256 amount, address token);

    /**
     * @notice Pay ETH to unlock a link
     * @param receiver The address of the creator who receives the funds
     * @param linkId The unique ID of the link (e.g. Supabase ID)
     */
    function payEth(address payable receiver, string calldata linkId) external payable {
        require(msg.value > 0, "Amount must be > 0");
        
        // Transfer funds directly to the receiver
        (bool sent, ) = receiver.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit Paid(msg.sender, receiver, linkId, msg.value, address(0));
    }

    /**
     * @notice Pay ERC20 (e.g. USDC) to unlock a link
     * @param token The address of the ERC20 token
     * @param receiver The address of the creator
     * @param linkId The unique ID of the link
     * @param amount The amount of tokens to pay
     */
    function payToken(address token, address receiver, string calldata linkId, uint256 amount) external {
        require(amount > 0, "Amount must be > 0");

        // Transfer tokens from payer to receiver
        // Note: Payer must have approved this contract to spend tokens
        bool sent = IERC20(token).transferFrom(msg.sender, receiver, amount);
        require(sent, "Token transfer failed");

        emit Paid(msg.sender, receiver, linkId, amount, token);
    }
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

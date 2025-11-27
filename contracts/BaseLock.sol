// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BaseLock
 * @dev Token-gated links on Base L2 with 1% fee.
 *      Only supports ERC20 tokens (USDC).
 */
contract BaseLock {
    address public owner;
    uint256 public constant FEE_BASIS_POINTS = 100; // 1% (100 / 10000)

    // Event emitted when a user pays to unlock a link
    event Paid(
        address indexed payer,
        address indexed receiver,
        string indexed linkId,
        uint256 amount,
        address token
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    /**
     * @notice Update the fee recipient
     * @param newOwner The address of the new owner
     */
    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    /**
     * @notice Pay ERC20 (USDC) to unlock a link
     * @param token The address of the ERC20 token
     * @param receiver The address of the creator
     * @param linkId The unique ID of the link
     * @param amount The total amount the user pays
     */
    function payToken(
        address token,
        address receiver,
        string calldata linkId,
        uint256 amount
    ) external {
        require(amount > 0, "Amount must be > 0");

        // Calculate fee (1%)
        uint256 fee = (amount * FEE_BASIS_POINTS) / 10000;
        uint256 receiverAmount = amount - fee;

        // Transfer fee to owner
        if (fee > 0) {
            bool feeSent = IERC20(token).transferFrom(msg.sender, owner, fee);
            require(feeSent, "Fee transfer failed");
        }

        // Transfer remaining amount to receiver
        if (receiverAmount > 0) {
            bool sent = IERC20(token).transferFrom(
                msg.sender,
                receiver,
                receiverAmount
            );
            require(sent, "Token transfer failed");
        }

        emit Paid(msg.sender, receiver, linkId, amount, token);
    }
}

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BaseLockV2
 * @dev Token-gated links on Base L2 with adjustable fee and ETH support.
 */
contract BaseLockV2 {
    address public owner;
    uint256 public feeBasisPoints = 100; // Default 1% (100 / 10000)
    uint256 public constant MAX_FEE = 500; // Max 5%

    // Event emitted when a user pays to unlock a link
    event Paid(
        address indexed payer,
        address indexed receiver,
        string indexed linkId,
        uint256 amount,
        address token // address(0) for native ETH
    );

    event FeeUpdated(uint256 newFee);
    event OwnerUpdated(address newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    /**
     * @notice Update the fee percentage
     * @param _newFee New fee in basis points (e.g. 100 = 1%)
     */
    function setFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= MAX_FEE, "Fee cannot exceed 5%");
        feeBasisPoints = _newFee;
        emit FeeUpdated(_newFee);
    }

    /**
     * @notice Update the contract owner
     * @param newOwner The address of the new owner
     */
    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
        emit OwnerUpdated(newOwner);
    }

    /**
     * @notice Pay with Native ETH to unlock a link
     * @param receiver The address of the creator
     * @param linkId The unique ID of the link
     */
    function payNative(
        address payable receiver,
        string calldata linkId
    ) external payable {
        require(msg.value > 0, "Amount must be > 0");

        uint256 fee = (msg.value * feeBasisPoints) / 10000;
        uint256 receiverAmount = msg.value - fee;

        // Transfer fee to owner
        if (fee > 0) {
            (bool feeSent, ) = payable(owner).call{value: fee}("");
            require(feeSent, "Fee transfer failed");
        }

        // Transfer remaining amount to receiver
        if (receiverAmount > 0) {
            (bool sent, ) = receiver.call{value: receiverAmount}("");
            require(sent, "ETH transfer failed");
        }

        emit Paid(msg.sender, receiver, linkId, msg.value, address(0));
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

        // Calculate fee
        uint256 fee = (amount * feeBasisPoints) / 10000;
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

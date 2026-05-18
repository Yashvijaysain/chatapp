import { ethers } from "ethers";

export const ChatAppAddress = "0xE2584873139cB8e1e2a5Ea70084B2C65D4ec56fd";

export const ChatAppABI = [
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "createAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "friendAddress", type: "address" },
      { internalType: "string", name: "name", type: "string" },
    ],
    name: "addFriend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "friendAddress", type: "address" },
      { internalType: "string", name: "message", type: "string" },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "friendAddress", type: "address" }],
    name: "readMessage",
    outputs: [
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "msg", type: "string" },
        ],
        internalType: "struct ChatApp.Message[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllAppUsers",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "address", name: "accountAddress", type: "address" },
        ],
        internalType: "struct ChatApp.AllUserStruct[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const requiredFunctions = [
  "createAccount",
  "getUserName",
  "addFriend",
  "sendMessage",
  "readMessage",
  "getAllAppUsers",
];

const ethereum = () =>
  typeof window !== "undefined" ? window.ethereum : undefined;

export const checkIfWalletConnected = async () => {
  try {
    if (!ethereum()) return "";

    const accounts = await ethereum().request({ method: "eth_accounts" });
    return accounts?.[0] || "";
  } catch (error) {
    console.error("Wallet connection check failed:", error);
    return "";
  }
};

export const connectWallet = async () => {
  try {
    if (!ethereum()) {
      throw new Error("Please install MetaMask.");
    }

    const accounts = await ethereum().request({
      method: "eth_requestAccounts",
    });

    return accounts?.[0] || "";
  } catch (error) {
    console.error("Wallet connection failed:", error);
    throw error;
  }
};

export const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ChatAppAddress, ChatAppABI, signerOrProvider);

export const validateContractSetup = () => {
  if (!ethers.utils.isAddress(ChatAppAddress)) {
    throw new Error("Paste your deployed contract address in utils/apiFeature.js.");
  }

  if (!Array.isArray(ChatAppABI) || ChatAppABI.length === 0) {
    throw new Error("Paste your contract ABI array in utils/apiFeature.js.");
  }

  const abiFunctionNames = ChatAppABI.filter((item) => item.type === "function").map(
    (item) => item.name
  );
  const missingFunctions = requiredFunctions.filter(
    (name) => !abiFunctionNames.includes(name)
  );

  if (missingFunctions.length) {
    throw new Error(`Your ABI is missing: ${missingFunctions.join(", ")}.`);
  }
};

export const connectingWithContract = async () => {
  try {
    validateContractSetup();

    if (!ethereum()) {
      throw new Error("Please install and unlock MetaMask.");
    }

    await ethereum().request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(ethereum(), "any");
    const code = await provider.getCode(ChatAppAddress);
    if (!code || code === "0x") {
      const network = await provider.getNetwork();
      throw new Error(
        `No contract found at ${ChatAppAddress} on the selected network (chainId ${network.chainId}). Switch MetaMask to the network where you deployed it.`
      );
    }

    const signer = provider.getSigner();

    return fetchContract(signer);
  } catch (error) {
    console.error("Contract connection failed:", error);
    throw error;
  }
};

export const convertTime = (timestamp) => {
  if (!timestamp) return "";

  const rawValue = ethers.BigNumber?.isBigNumber?.(timestamp)
    ? timestamp.toNumber()
    : Number(timestamp);
  if (!Number.isFinite(rawValue)) return "";

  const milliseconds = rawValue < 10 ** 12 ? rawValue * 1000 : rawValue;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(milliseconds));
};

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../utils/apiFeature";

export const ChatAppContext = createContext();

const getFriendList = async (contract) => {
  if (typeof contract.getMyFriendList === "function") {
    return contract.getMyFriendList();
  }

  if (typeof contract.getFriendList === "function") {
    return contract.getFriendList();
  }

  return [];
};

export const ChatAppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [username, setUsername] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [friendMessage, setFriendMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const connectedAccount = await checkIfWalletConnected();
      setAccount(connectedAccount);

      if (!connectedAccount) return;

      const contract = await connectingWithContract();
      const name = await contract.getUserName(connectedAccount);
      const users = await contract.getAllAppUsers();
      const friends = await getFriendList(contract);

      setUsername(name);
      setUserLists(users || []);
      setFriendList(friends || []);
    } catch (err) {
      setError(err?.reason || err?.message || "Unable to load chat data.");
    }
  }, []);

  const readMessage = useCallback(async (address) => {
    try {
      if (!address) return;

      const contract = await connectingWithContract();
      const messages = await contract.readMessage(address);
      setFriendMessage(messages || []);
    } catch (err) {
      setError(err?.reason || err?.message || "Unable to read messages.");
    }
  }, []);

  const createAccount = useCallback(async ({ name }) => {
    try {
      if (!name) {
        setError("Please enter a name.");
        return;
      }

      setLoading(true);
      const contract = await connectingWithContract();
      const transaction = await contract.createAccount(name);
      await transaction.wait();
      await fetchData();
    } catch (err) {
      setError(err?.reason || err?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const addFriend = useCallback(async ({ name, address }) => {
    try {
      if (!name || !address) {
        setError("Please enter your friend's name and address.");
        return;
      }

      setLoading(true);
      const contract = await connectingWithContract();
      const transaction = await contract.addFriend(address, name);
      await transaction.wait();
      await fetchData();
    } catch (err) {
      setError(err?.reason || err?.message || "Unable to add friend.");
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const sendMessage = useCallback(async ({ message, address }) => {
    try {
      if (!message || !address) {
        setError("Please enter a message.");
        return;
      }

      setLoading(true);
      const contract = await connectingWithContract();
      const transaction = await contract.sendMessage(address, message);
      await transaction.wait();
      await readMessage(address);
    } catch (err) {
      setError(err?.reason || err?.message || "Unable to send message.");
    } finally {
      setLoading(false);
    }
  }, [readMessage]);

  const readUser = useCallback(async (address) => {
    try {
      if (!address) return;

      const contract = await connectingWithContract();
      const name = await contract.getUserName(address);

      setCurrentUserName(name);
      setCurrentUserAddress(address);
    } catch (err) {
      setError(err?.reason || err?.message || "Unable to read user.");
    }
  }, []);

  const clearFriendMessage = useCallback(() => {
    setFriendMessage([]);
  }, []);

  const connectWalletUser = useCallback(async () => {
    try {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      await fetchData();
    } catch (err) {
      setError(err?.reason || err?.message || "Unable to connect wallet.");
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = useMemo(
    () => ({
      account,
      username,
      friendList,
      friendMessage,
      loading,
      userLists,
      error,
      currentUserName,
      currentUserAddress,
      fetchData,
      readMessage,
      createAccount,
      addFriend,
      sendMessage,
      readUser,
      connectWallet: connectWalletUser,
      clearFriendMessage,
      setError,
    }),
    [
      account,
      username,
      friendList,
      friendMessage,
      loading,
      userLists,
      error,
      currentUserName,
      currentUserAddress,
      fetchData,
      readMessage,
      createAccount,
      addFriend,
      sendMessage,
      readUser,
      connectWalletUser,
      clearFriendMessage,
    ]
  );

  return (
    <ChatAppContext.Provider value={value}>{children}</ChatAppContext.Provider>
  );
};

import { useContext, useState } from "react";
import Image from "next/image";
import { clear, search, username } from "../assets";
import { ChatAppContext } from "../context/ChatAppContext";
import Model from "./Model";
import Style from "./Filter.module.css";

const Filter = () => {
  const { addFriend, clearFriendMessage } = useContext(ChatAppContext);
  const [openBox, setOpenBox] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <section className={Style.filter}>
      {openBox && (
        <Model
          openBox={openBox}
          setOpenBox={setOpenBox}
          title="Add Friend"
          head="Add a friend"
          info="Save a contact by wallet address and display name."
          smallInfo="Messages can be exchanged after the transaction confirms."
          image={username}
          functionName={addFriend}
        />
      )}

      <label className={Style.searchBox}>
        <Image src={search} alt="" width={22} height={22} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search friends"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <button className={Style.action} type="button" onClick={() => setOpenBox(true)}>
        Add Friend
      </button>
      <button
        className={Style.iconButton}
        type="button"
        onClick={clearFriendMessage}
        aria-label="Clear chat"
      >
        <Image src={clear} alt="" width={22} height={22} aria-hidden="true" />
      </button>
    </section>
  );
};

export default Filter;

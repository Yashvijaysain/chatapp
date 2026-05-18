import { useContext } from "react";
import { ChatAppContext } from "../context/ChatAppContext";
import Card from "./Card";
import Chat from "./Chat";
import Style from "./Friend.module.css";

const Friend = () => {
  const { friendList, readMessage, readUser } = useContext(ChatAppContext);

  return (
    <section className={Style.friend}>
      <aside className={Style.left}>
        {friendList?.length ? (
          friendList.map((friend, index) => (
            <Card
              key={`${friend.pubkey || friend.accountAddress || friend[0]}-${index}`}
              friend={friend}
              index={index}
              readMessage={readMessage}
              readUser={readUser}
            />
          ))
        ) : (
          <p className={Style.empty}>No friends yet</p>
        )}
      </aside>
      <div className={Style.right}>
        <Chat />
      </div>
    </section>
  );
};

export default Friend;

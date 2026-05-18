import { useContext } from "react";
import Image from "next/image";
import {
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
} from "../assets";
import { ChatAppContext } from "../context/ChatAppContext";
import Style from "./UserCard.module.css";

const avatars = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
];

const normalizeUser = (user) => ({
  name: user?.name || user?.[1] || "Unnamed",
  address: user?.accountAddress || user?.pubkey || user?.[0] || "",
});

const UserCard = () => {
  const { userLists, addFriend } = useContext(ChatAppContext);

  return (
    <section className={Style.grid}>
      {userLists?.map((user, index) => {
        const { name, address } = normalizeUser(user);

        return (
          <article className={Style.card} key={`${address}-${index}`}>
            <Image
              src={avatars[index % avatars.length]}
              alt={`${name} avatar`}
              width={86}
              height={86}
            />
            <h3>{name}</h3>
            <p>{address}</p>
            <button type="button" onClick={() => addFriend({ name, address })}>
              Add Friend
            </button>
          </article>
        );
      })}
    </section>
  );
};

export default UserCard;

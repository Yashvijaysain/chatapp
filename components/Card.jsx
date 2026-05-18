import Image from "next/image";
import { useRouter } from "next/router";
import { image1, image2, image3, image4, image5 } from "../assets";
import Style from "./Card.module.css";

const avatars = [image1, image2, image3, image4, image5];

const normalizeFriend = (friend) => ({
  name: friend?.name || friend?.[1] || "Unnamed",
  address: friend?.pubkey || friend?.accountAddress || friend?.[0] || "",
});

const sliceAddress = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

const Card = ({ friend, index, readMessage, readUser }) => {
  const router = useRouter();
  const { name, address } = normalizeFriend(friend);

  const handleClick = async () => {
    await readMessage(address);
    await readUser(address);
    router.push({
      pathname: router.pathname,
      query: { name, address },
    });
  };

  return (
    <button className={Style.card} type="button" onClick={handleClick}>
      <Image
        src={avatars[index % avatars.length]}
        alt={`${name} avatar`}
        width={54}
        height={54}
      />
      <span>
        <strong>{name}</strong>
        <small>{sliceAddress(address)}</small>
      </span>
    </button>
  );
};

export default Card;

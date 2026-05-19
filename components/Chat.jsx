import { useContext, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { file, image6, send, smile } from "../assets";
import { ChatAppContext } from "../context/ChatAppContext";
import { convertTime } from "../utils/apiFeature";
import Loader from "./Loader";
import Style from "./Chat.module.css";

const getSender = (message) =>
  message?.sender || message?.from || message?.[0] || "";

const getText = (message) =>
  message?.content || message?.msg || message?.message || message?.text || message?.[2] || "";

const getTimestamp = (message) =>
  message?.timestamp || message?.time || message?.[1] || "";

const Chat = () => {
  const router = useRouter();
  const { account, friendMessage, loading, sendMessage } =
    useContext(ChatAppContext);
  const [message, setMessage] = useState("");
  const name = router.query.name || "";
  const address = router.query.address || "";

  const handleSend = async (event) => {
    event.preventDefault();
    await sendMessage({ message, address });
    setMessage("");
  };

  if (!address) {
    return (
      <div className={Style.placeholder}>
        <Image src={image6} alt="" width={120} height={120} />
        <p>Select a friend to start chatting</p>
      </div>
    );
  }

  return (
    <section className={Style.chat}>
      <header className={Style.header}>
        <Image src={image6} alt={`${name} avatar`} width={52} height={52} />
        <span>
          <strong>{name}</strong>
          <small>{address}</small>
        </span>
      </header>

      <div className={Style.messages}>
        {friendMessage?.map((item, index) => {
          const sender = getSender(item).toLowerCase();
          const sentByMe = sender === account?.toLowerCase();

          return (
            <article
              key={`${getTimestamp(item)}-${index}`}
              className={`${Style.message} ${
                sentByMe ? Style.sent : Style.received
              }`}
            >
              <p>{getText(item)}</p>
              <time>{convertTime(getTimestamp(item))}</time>
            </article>
          );
        })}
      </div>

      <form className={Style.composer} onSubmit={handleSend}>
        <Image src={smile} alt="" width={24} height={24} aria-hidden="true" />
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="button" className={Style.attach} aria-label="Attach file">
          <Image src={file} alt="" width={22} height={22} aria-hidden="true" />
        </button>
        <button type="submit" className={Style.send} disabled={loading}>
          {loading ? (
            <Loader compact />
          ) : (
            <Image src={send} alt="Send" width={22} height={22} />
          )}
        </button>
      </form>
    </section>
  );
};

export default Chat;

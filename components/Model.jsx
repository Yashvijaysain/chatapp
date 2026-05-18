import { useContext, useState } from "react";
import Image from "next/image";
import { account, close } from "../assets";
import { ChatAppContext } from "../context/ChatAppContext";
import Loader from "./Loader";
import Style from "./Model.module.css";

const Model = ({
  openBox,
  setOpenBox,
  title,
  head,
  info,
  smallInfo,
  image,
  functionName,
}) => {
  const { account: connectedAccount, loading } = useContext(ChatAppContext);
  const [form, setForm] = useState({ name: "", address: "" });

  if (!openBox) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    functionName({
      name: form.name,
      address: form.address || connectedAccount,
    });
  };

  return (
    <div className={Style.overlay} role="dialog" aria-modal="true">
      <form className={Style.model} onSubmit={handleSubmit}>
        <button
          className={Style.close}
          type="button"
          onClick={() => setOpenBox(false)}
          aria-label="Close"
        >
          <Image src={close} alt="" width={20} height={20} aria-hidden="true" />
        </button>

        <Image src={image || account} alt="" width={92} height={92} />
        <p className={Style.title}>{title}</p>
        <h2>{head}</h2>
        <p className={Style.info}>{info}</p>
        <p className={Style.smallInfo}>{smallInfo}</p>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(event) =>
            setForm((data) => ({ ...data, name: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(event) =>
            setForm((data) => ({ ...data, address: event.target.value }))
          }
        />

        <button className={Style.submit} type="submit" disabled={loading}>
          {loading ? <Loader compact /> : title}
        </button>
      </form>
    </div>
  );
};

export default Model;

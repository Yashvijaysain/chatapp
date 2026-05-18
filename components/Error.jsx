import Image from "next/image";
import { close } from "../assets";
import Style from "./Error.module.css";

const Error = ({ error, clearError }) => {
  if (!error) return null;

  return (
    <aside className={Style.error} role="alert">
      <p>{error}</p>
      <button type="button" onClick={clearError} aria-label="Dismiss error">
        <Image src={close} alt="" width={18} height={18} aria-hidden="true" />
      </button>
    </aside>
  );
};

export default Error;

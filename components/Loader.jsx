import Image from "next/image";
import { loader } from "../assets";
import Style from "./Loader.module.css";

const Loader = ({ compact = false }) => (
  <span className={compact ? Style.compact : Style.loader}>
    <Image src={loader} alt="Loading" width={compact ? 22 : 72} height={compact ? 22 : 72} />
  </span>
);

export default Loader;

import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChatAppContext } from "../context/ChatAppContext";
import { close, create, open } from "../assets";
import Error from "./Error";
import Model from "./Model";
import Style from "./NavBar.module.css";
import Image from "next/image";

const menuItems = [
  { name: "Chat", path: "/" },
  { name: "Users", path: "/alluser" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const NavBar = () => {
  const router = useRouter();
  const { account, username, connectWallet, createAccount, error, setError } =
    useContext(ChatAppContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  const handleWallet = () => {
    if (account && username) return;
    if (account && !username) {
      setOpenBox(true);
      return;
    }
    connectWallet();
  };

  return (
    <nav className={Style.navbar}>
      {error && <Error error={error} clearError={() => setError("")} />}
      {openBox && (
        <Model
          openBox={openBox}
          setOpenBox={setOpenBox}
          title="Create Account"
          head="Create your chat identity"
          info="Register a display name for your wallet."
          smallInfo="Your address is detected from the connected wallet."
          image={create}
          functionName={createAccount}
        />
      )}

      <Link href="/" className={Style.brand} aria-label="Blockchain Chat">
        <img src="/logo.png" alt="Blockchain Chat" />
      </Link>

      <div className={Style.menu}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`${Style.menuItem} ${
              router.pathname === item.path ? Style.active : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <button className={Style.wallet} type="button" onClick={handleWallet}>
        {username || (account ? "Create Account" : "Connect Wallet")}
      </button>

      <button
        className={Style.mobileToggle}
        type="button"
        onClick={() => setActiveMenu((value) => !value)}
        aria-label="Toggle menu"
      >
        <Image
          src={activeMenu ? close : open}
          alt=""
          width={28}
          height={28}
          aria-hidden="true"
        />
      </button>

      {activeMenu && (
        <div className={Style.mobileMenu}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={Style.mobileMenuItem}
              onClick={() => setActiveMenu(false)}
            >
              {item.name}
            </Link>
          ))}
          <button className={Style.mobileWallet} type="button" onClick={handleWallet}>
            {username || (account ? "Create Account" : "Connect Wallet")}
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

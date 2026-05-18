import NavBar from "../components/NavBar";

export default function About() {
  return (
    <>
      <NavBar />
      <main className="simplePage">
        <h1>BlockChat</h1>
        <p>A wallet-based chat DApp built with Next.js, Solidity, Hardhat, Ethers.js, and Web3Modal.</p>
      </main>
    </>
  );
}

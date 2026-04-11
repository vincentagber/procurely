import { Metadata } from "next";
import WalletClient from "./wallet-client";

export const metadata: Metadata = {
  title: "Wallet & Payments | Procurely",
  description: "Manage your wallet balance, transactions, and payment methods.",
};

export default function WalletPage() {
  return (
    <WalletClient />
  );
}

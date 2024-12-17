"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Home from "./Home";

export default function App() {
	const config = getDefaultConfig({
		appName: "Smart Wallet Signature Verify App",
		projectId: "8373506f48599113bf5e6cd538b5d1ea",
		// projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
		chains: [mainnet, polygon, optimism, arbitrum, base],
		ssr: false, // If your dApp uses server side rendering (SSR)
	});
	const queryClient = new QueryClient();

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
						<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
							<div className="flex gap-4 items-center flex-col sm:flex-row">
								<Home />
							</div>
						</main>
					</div>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}

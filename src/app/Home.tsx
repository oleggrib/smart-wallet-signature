"use client";

import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import { Hex } from "viem";
import { SiweMessage } from "siwe";

export default function Home() {
	const account = useAccount();
	const client = usePublicClient();


	function getMsg() {
		return new SiweMessage({
			domain: "localhost:3000",
			address: account.address,
			chainId: account.chainId,
			uri: "localhost:3000",
			version: "1",
			statement: "Smart Wallet SIWE Example",
			nonce: "12345678",
		});
	}

	const [readyMsg, setReadyMsg] = useState("");
	const [signature, setSignature] = useState<Hex | undefined>(undefined);
	const { signMessage } = useSignMessage({
		mutation: { onSuccess: (sig) => setSignature(sig) },
	});
	const [valid, setValid] = useState<boolean | undefined>(undefined);

	const checkValid = useCallback(async () => {
		if (!signature || !account.address || !client) return;
		client
			.verifyMessage({
				address: account.address,
				message: readyMsg,
				signature,
			})
			.then((v) => setValid(v));
	}, [signature, account]);

	useEffect(() => {
		checkValid();
	}, [signature, account]);

	return (
		<div className="flex gap-4 items-start flex-col">
			<ConnectButton showBalance={false} />
			<button
				className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
				onClick={() => {
                    const _msgReady = getMsg()?.prepareMessage();
					setReadyMsg(_msgReady);
					if (!_msgReady) return;
					signMessage({ message: _msgReady });
				}}>
				Sign & Verify
			</button>

			<p>{}</p>
			{readyMsg && <p className="break-all">Message: {readyMsg}</p>}
			{valid != undefined && (
				<p>
					{" "}
					Is valid:{" "}
					<span className={valid ? "text-green-500" : "text-red-500"}>
						{valid.toString()}
					</span>{" "}
				</p>
			)}
			{signature && <p className="break-all">Signature: {signature}</p>}
		</div>
	);
}

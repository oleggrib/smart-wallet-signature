"use client";

import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Hex } from "viem";
import { SiweMessage } from "siwe";

export default function Home() {
	const account = useAccount();
	const client = usePublicClient();

	// const message = "123"
	// const message = useMemo(() => {
	//     console.log(account.address, account.chainId)
	// 	return new SiweMessage({
	// 		// domain: document.location.host,
	// 		domain: "localhost:3000",
	// 		address: account.address,
	// 		chainId: account.chainId,
	// 		// uri: document.location.origin,
	// 		uri: "localhost:3000",
	// 		version: "1",
	// 		statement: "Smart Wallet SIWE Example",
	// 		nonce: "12345678",
	// 	});
	// }, [account.address, account.chainId]);

	function getMsg() {
		return new SiweMessage({
			// domain: document.location.host,
			domain: "localhost:3000",
			address: account.address,
			chainId: account.chainId,
			// uri: document.location.origin,
			uri: "localhost:3000",
			version: "1",
			statement: "Smart Wallet SIWE Example",
			nonce: "12345678",
		});
	}

	const [msg, setMsg] = useState<SiweMessage | undefined>(undefined);
	const [signature, setSignature] = useState<Hex | undefined>(undefined);
	const { signMessage } = useSignMessage({
		mutation: { onSuccess: (sig) => setSignature(sig) },
	});
	const [valid, setValid] = useState<boolean | undefined>(undefined);

	const checkValid = useCallback(async () => {
		if (!signature || !account.address || !client) return;
		console.log(msg?.prepareMessage());
		console.log(signature);
		console.log(account.address);
		client
			.verifyMessage({
				address: account.address,
				message: getMsg().prepareMessage(),
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
                    const _msg = getMsg();
					setMsg(_msg);
					if (!_msg) return;
					console.log(_msg?.prepareMessage());
					signMessage({ message: _msg.prepareMessage() });
				}}>
				Sign & Verify
			</button>

			<p>{}</p>
			{valid != undefined && <p> Is valid: <span className={valid ? 'text-green-500' : 'text-red-500'}>{valid.toString()}</span> </p>}
			{signature && <p className="break-all">Signature: {signature}</p>}
		</div>
	);
}

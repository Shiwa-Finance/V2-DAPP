import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import { APP_NAME, CHAIN_RPC, CHAIN_LIST } from "../config/appconf";

export const { chains, provider, webSocketProvider } = configureChains(
    CHAIN_LIST,
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: CHAIN_RPC
            }),
        }),
        publicProvider(),
    ]
);

export const { connectors } = getDefaultWallets({
    appName: APP_NAME,
    chains,
});

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
});


import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { BrowserRouter } from "react-router-dom";
import { wagmiClient, chains } from "./connection/Wallet";
import AppRoutes from "./routes/Routes";

const App = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;

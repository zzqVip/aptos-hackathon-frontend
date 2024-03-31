
import { Route, Routes } from 'react-router-dom'
import CreateActiveFund from './pages/CreateVaultPage/CreateVaultPage'
import { BrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout/Layout';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { ConfigProvider, theme } from "antd";
import DetailsPage from '../src/pages/DetailsPage/DetailsPage'
import VaultsPage from '../src/pages/VaultsPage/VaultsPage'
const wallets = [new PetraWallet()];
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/createactivefund" element={< CreateActiveFund />}></Route>
        <Route path="/details" element={< DetailsPage />}></Route>
        <Route path="/vaults" element={< VaultsPage />}></Route>
        <Route path="*" element={<Navigate to="/vaults" replace />} />
      </Routes>
    </div>
  )
}

export default () => (
  <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#50F6BF",
        },
        components: {
          Table: {
            borderRadius: 4,
            borderRadiusLG: 6,
            colorBgContainer: "transparent",
            fontSize: 14,
            rowHoverBg: "var(--bg-third-hover-color)",
            colorText: "var(--text-third-color)",
          },
          Button: {
            colorText: "var(--text-third-color)",
            colorBorder: "var(--border-third-color)",
            colorBgContainer: "transparent",
            textHoverBg: "#fff",
            borderRadius: ("var(--border-radius-lg)" as any),
          },

          Select: {
            colorText: "var(--text-third-color)",
            colorBorder: "var(--border-third-color)",
            colorBgContainer: "transparent",
          },
          Popover: {
            colorBgElevated: "rgba(48,48,48, 0.9)",
          },
        },
      }}
    >
      <BrowserRouter>
        <Layout>
          <App />
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  </AptosWalletAdapterProvider >
)

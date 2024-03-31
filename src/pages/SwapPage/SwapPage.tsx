import { useState } from "react";
import Swap from '../../components/Swap/Swap'
const priceMap = {
    a1: 0.5,
    b1: 1,
    c1: 2,
    d1: 4,
}
export type SwapStatus = 'swap' | 'loading' | 'success' | 'error' | ""
const SwapPage = ({ vaultBalanceMap, priceFeedList, calculatePriceFuc, confirmTransactionEvt }: any) => {
    let supportSellList = [
        { name: "APT", symbol: "APT", pythAddress: "0x44a93dddd8effa54ea51076c4e851b6cbbfd938e82eb90197de38fe8876bb66e" },
        { name: "BTC", symbol: "BTC", pythAddress: "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b" },
        { name: "ETH", symbol: "ETH", pythAddress: "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6" },
        { name: "USDC", symbol: "USDC", pythAddress: "0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722" }
    ]

    let supportBuyList = [
        { name: "APT", symbol: "APT", pythAddress: "0x44a93dddd8effa54ea51076c4e851b6cbbfd938e82eb90197de38fe8876bb66e" },
        { name: "BTC", symbol: "BTC", pythAddress: "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b" },
        { name: "ETH", symbol: "ETH", pythAddress: "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6" },
        { name: "USDC", symbol: "USDC", pythAddress: "0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722" }
    ]

    const [sellAmount, setSellAmount] = useState(0)
    const [buyAmount, setBuyAmount] = useState(0)
    const [confirmReturnStatus, setConfirmReturnStatus] = useState("swap" as SwapStatus)




    const returnList = {
        swap: <Swap
            supportSellList={supportSellList as any}
            supportBuyList={supportBuyList as any}
            userHoldList={vaultBalanceMap}
            confirmTransactionEvt={confirmTransactionEvt}
            calculatePriceFuc={calculatePriceFuc}
            priceFeedList={priceFeedList}
        />,
        loading: <>Loading</>,
        success: <>Success</>,
        error: <>Error</>
    }

    return <>
        {
            returnList[confirmReturnStatus]
        }
    </>
}
export default SwapPage
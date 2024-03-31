import React, { useEffect, useRef, useState } from "react";
import {
  Tabs,
  Segmented,
  Select,
  Space,
  Modal,
  Input,
  Radio,
  InputNumber,
  Slider,
  Spin,
  Checkbox
} from "antd";
import { AptosPriceServiceConnection } from '@pythnetwork/pyth-aptos-js'
import {
  ArrowLeftOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import classes from "./style.module.less";
import { useSearchParams, useNavigate } from "react-router-dom";
import AssetTable from "./TableType/AssetTable/AssetTable";
import DepositorTable from './TableType/DepositorTable/DepositorTable'
import Chart from "../../components/Chart/Chart";
import Tokenimg from "../../components/Tokenimg/Tokenimg";
import imge from '../../assets/icon/share.png'
import SwapPage from "../SwapPage/SwapPage";
import ActivityTable from '../../components/ActiveTable/ActivityTable';
import supportedToken from '../../../supportedToken.json'
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { moduleAddress } from '../../Const/Const'
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
const marks = {
  0: "0%",
  25: "25%",
  50: "50%",
  75: "75%",
  100: "100%",
};
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);
function getTimeDifference(timestamp: any) {
  const now = Date.now(); // Current time in milliseconds
  const difference = Math.abs(now - timestamp) / 1000; // Difference in seconds

  const hours = Math.floor(difference / 3600); // Remaining hours
  const minutes = Math.floor((difference % 3600) / 60); // Remaining minutes
  const seconds = Math.floor(difference % 60); // Remaining seconds

  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
  if (seconds > 0) {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }

  return 'just now';
}

const aptosPriceServiceConnection = new AptosPriceServiceConnection(
  "https://hermes-beta.pyth.network"
);
const DetailsPage = () => {
  const { signAndSubmitTransaction, account } = useWallet();
  const cloneActiveList = useRef(null as any)
  const navigate = useNavigate();
  const [params] = useSearchParams()
  const [dataSource, setDataSource] = useState({} as any)
  const [swapModalOpen, setSwapModalOpen] = useState(false)
  const [activeList, setActiveList] = useState([] as any)
  const [investModal, setInvestModal] = useState(false)
  const [reddeemModal, setReddeemModal] = useState(false)
  const [selectInvestToken, setSelectInvestToken] = useState("")
  const [investAmount, setInvestAmount] = useState(0)
  const [investModalState, setInvestModalState] = useState({ state: "invest", msg: "" })
  const [reddeemModalState, setReddeemModalState] = useState({ state: "reddeem", msg: "" })
  const [swapModalState, setSwapModalState] = useState({ state: "swap", msg: "" })
  const [holders, setHolders] = useState([])
  const [vaultAssets, setVaultAssets] = useState([] as any)
  const [withdrawNum, setWithdrawNum] = useState(0)
  const [selectActiveType, setSelectActiveType] = useState("")
  const [userBalance, setUserBalance] = useState({} as any)
  const [vaultBalanceMap, setVaultBalanceMap] = useState({} as any)
  const [priceFeedList, setPriceFeedList] = useState({} as any)
  const [selectWithdrawToken, setSelectWithdrawToken] = useState([] as any)
  const [tokens, setTokens] = useState([])
  const [userHoldUsd, setUserHoldUsd] = useState(0)
  const [aum, setAum] = useState(0)
  const [checkBoxOptions, setCheckBoxOptions] = useState([] as any)
  const [vaultCreateTime, setVaultCreateTime] = useState("")
  const [vaultInfo, setVaultInfo] = useState({} as any)
  const priceIds = [
    "0x44a93dddd8effa54ea51076c4e851b6cbbfd938e82eb90197de38fe8876bb66e", //Apt
    "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b", //BTC
    "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", //ETH
    "0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722"  //USDC
  ]
  const checkBoxDisabel = [
    "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6", //ETH
    "0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722"
  ]
  const filterKey = ["Deposit", "Withdraw", "Swap"]
  const onChainFuc = async () => {
    const priceUpdateData = await aptosPriceServiceConnection.getPriceFeedsUpdateData(priceIds);
    return priceUpdateData
  }
  const Deposit = async (priceUpdateData: any) => {
    setInvestModalState({ state: "loading", msg: "" })
    const transaction: InputTransactionData = {
      data: {
        typeArguments: [supportedToken[selectInvestToken].asset_type],
        function: `${moduleAddress}::vault::deposit`,
        functionArguments: [params.getAll("symbol")[0], investAmount * Math.pow(10, supportedToken[selectInvestToken].decimals), priceUpdateData]
      }
    }
    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash })
      setInvestModalState({ state: "success", msg: "Invest successful!" })
      refreshPageData()
    } catch (e) {
      setInvestModalState({ state: "error", msg: "Signing declined!" })
    }
  }

  const items = [
    {
      key: "1",
      label: "Chart",
      children: (
        <div>
          <Space wrap>
            <Segmented
              defaultValue={"aum"}
              options={[
                { label: "Aum", value: "aum" },
                { label: "Nav", value: "nav" },
              ]}
            />
            <Select
              defaultValue="1d"
              style={{ width: 120 }}
              options={[
                { value: "1d", label: "1 Day" },
                { value: "7d", label: "1 Week" },
                { value: "30d", label: "30 Days" },
                { value: "180d", label: "180 Days" },
                { value: "365d", label: "1 Year" },
              ]}
            />
          </Space>
          <Chart />
        </div>
      ),
    },
    {
      key: "2",
      label: "Assets",
      children: <AssetTable assetList={vaultAssets} priceFeedList={priceFeedList} />,
    },
    {
      key: "3",
      label: "Investors",
      children: <DepositorTable DepositorList={holders} />,
    },
    {
      key: "4",
      label: "Activities",
      children: (
        <div>
          <Space
            wrap
            style={{
              marginBottom: "16px",
            }}
          >
            {filterKey.map(it => {
              return <div
                className={`plainBtn ${it === selectActiveType && "plainBtnActive"}`}
                onClick={() => {
                  setActiveBtnStatusFuc(it)
                }}
              >
                {it}
              </div>
            })}
          </Space>
          <ActivityTable activityList={activeList} vaultInfo={vaultInfo} />
        </div>
      ),
    },
  ];

  const parser = (value: any) => {
    return value.replace(/[^\d.]/g, ''); // 去除非数字和小数点
  };

  const investStatusDom = {
    "invest": <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        fontWeight: "bold",
        marginBottom: "16px"
      }}>
        Invest
      </div>
      Your balance:
      <Radio.Group
        onChange={(e) => {
          setInvestAmount(0)
          setSelectInvestToken(e.target.value)
        }}
        value={selectInvestToken}
      >
        <div style={{
          display: "flex",
          flexWrap: "wrap",

        }}>
          {priceIds.map(it => {
            return <Radio value={it}
              disabled={checkBoxDisabel.includes(it)}
              style={{
                width: "48%",
                marginTop: "10px"
              }}>
              <div style={{
                display: "flex",
              }}>
                {supportedToken[it].name}
                <img src={supportedToken[it].logo} alt="logo" width={20} height={20}
                  style={{
                    marginLeft: "4px",
                    marginRight: "10px"
                  }} />

                {userBalance[supportedToken[it].asset_type] ? userBalance[supportedToken[it].asset_type] : 0}
              </div>
            </Radio>
          })}
        </div>
      </Radio.Group >
      <InputNumber
        style={{
          width: "50%",
          marginTop: "20px"
        }}
        min={0}
        placeholder="0"
        parser={parser}
        max={Number(userBalance[supportedToken[selectInvestToken]?.asset_type]) ? Number(userBalance[supportedToken[selectInvestToken].asset_type]) : 0}
        onChange={(v) => {
          setInvestAmount(v)
        }}
      />
    </div >,
    "loading": <div style={{
      width: "100%",
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}><Spin></Spin></div>,
    "success": <>{investModalState.msg}</>,
    "error": <>{investModalState.msg}</>
  }

  const reddeemModalDom = {
    "reddeem": <>
      <div style={{
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 var(--margin-md) 0+"
      }}>Redeem from this fund</div>
      Your balance: ${userHoldUsd.toFixed(2)} USD
      <Slider
        marks={marks}
        step={1}
        onChange={(e) => {
          setWithdrawNum(e / 100)
          for (let i = 0; i < checkBoxOptions.length; i++) {
            checkBoxOptions[i].disabled = false
          }
          setCheckBoxOptions([...checkBoxOptions])
        }}
      />
      <div style={{
        marginTop: "12px",
        marginBottom: "6px"
      }}>
        Redeem amount: ${(withdrawNum * userHoldUsd).toFixed(2)} USD
      </div>
      <Checkbox.Group options={checkBoxOptions}
        disabled={userHoldUsd === 0 || (withdrawNum * userHoldUsd) === 0 ? true : false}
        onChange={(array: any) => {
          setSelectWithdrawToken([...array])
          let num = 0
          for (let i = 0; i < array.length; i++) {
            num = num + vaultBalanceMap[array[i]] * priceFeedList[array[i]]
          }
          if (num > withdrawNum * userHoldUsd) {
            for (let i = 0; i < checkBoxOptions.length; i++) {
              if (checkBoxOptions[i].value !== array[i]) {
                checkBoxOptions[i].disabled = true
              }
            }
          } else {
            for (let i = 0; i < checkBoxOptions.length; i++) {
              checkBoxOptions[i].disabled = false
            }
          }
          setCheckBoxOptions([...checkBoxOptions])
        }} />
    </>,
    "loading": <div style={{
      width: "100%",
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}><Spin></Spin></div>,
    "success": <>{reddeemModalState.msg}</>,
    "error": <>{reddeemModalState.msg}</>
  }


  const investEvt = async () => {
    let priceUpdateData = await onChainFuc()
    Deposit(priceUpdateData)
  }

  const withdrawFuc = async () => {
    setReddeemModalState({ state: "loading", msg: "" })
    let base = ["0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::BTC", "0xb4d7b2466d211c1f4629e8340bb1a9e75e7f8fb38cc145c54c5c9f9d5017a318::coins_extended::ETH", "0x1::aptos_coin::AptosCoin"]
    let typeArguments = [] as any
    for (let i = 0; i < selectWithdrawToken.length; i++) {
      typeArguments.push(supportedToken[selectWithdrawToken[i]].asset_type)
    }
    let missingItems = base.filter(item => !typeArguments.includes(item));
    typeArguments = typeArguments.concat(missingItems)
    let priceUpdateData = await onChainFuc()
    const transaction: InputTransactionData = {
      data: {
        typeArguments: [...typeArguments],
        function: `${moduleAddress}::vault::withdraw`,
        functionArguments: [params.getAll("symbol")[0], withdrawNum * 10000, priceUpdateData]
      }
    }
    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash })
      refreshPageData()
      setReddeemModalState({ state: "success", msg: "Redeem successful!" })
    } catch (e) {
      setReddeemModalState({ state: "error", msg: "Signing declined!" })
    }
  }

  const swapEvt = async (sellToken: any, buyToken: any, sellAmount: any) => {
    setSwapModalState({ state: "loading", msg: "" })
    const transaction: InputTransactionData = {
      data: {
        typeArguments: ["0x1::aptos_coin::AptosCoin", "0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::BTC"],
        function: `${moduleAddress}::vault::swap_exact_input`,
        functionArguments: [params.getAll("symbol")[0], sellAmount * Math.pow(10, supportedToken[sellToken.pythAddress].decimals), 0]
      }
    }
    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash })
      refreshPageData()
      setSwapModalState({ state: "success", msg: "Swap Success!" })
    } catch (e) {
      setSwapModalState({ state: "error", msg: "Signing declined!" })
    }
  }

  const calculatePriceFuc = async (sellToken: string | number, buyToken: string | number, changeAmount: number, changeType: string): Promise<any> => {
    let payload: InputViewFunctionData = {} as any
    if (changeType === 'sell') {
      payload = {
        function: `${moduleAddress}::vault::get_amount_out`,
        typeArguments: [supportedToken[sellToken].asset_type, supportedToken[buyToken].asset_type],
        functionArguments: [changeAmount * Math.pow(10, supportedToken[sellToken].decimals)],
      };
    } else {
      payload = {
        function: `${moduleAddress}::vault::get_amount_out`,
        typeArguments: [supportedToken[buyToken].asset_type, supportedToken[sellToken].asset_type],
        functionArguments: [changeAmount * Math.pow(10, supportedToken[sellToken].decimals)],
      };
    }
    const info = await aptos.view({ payload }) as any
    return info[0] / Math.pow(10, supportedToken[buyToken].decimals)
  }

  const setInvestModalStateFuc = () => {
    setInvestModal(false)
    setInvestAmount(0)
    setSelectInvestToken("")
    setInvestModalState({ state: "invest", msg: "" })
  }

  const setActiveBtnStatusFuc = (type: any) => {
    if (type === selectActiveType) {
      setSelectActiveType("")
      setActiveList([...cloneActiveList.current])
      return
    }
    let f = cloneActiveList.current.filter((it: any) => it.operation === type)
    setActiveList([...f])
    setSelectActiveType(type)
  }

  const fetchPriceFeed = async () => {
    const priceFeeds = await aptosPriceServiceConnection.getLatestPriceFeeds(priceIds) as any
    let tempt = {} as any
    for (let i = 0; i < priceFeeds?.length; i++) {
      tempt['0x' + priceFeeds[i].id] = Number(priceFeeds[i].getPriceNoOlderThan(60)?.price) / Math.pow(10, Math.abs(priceFeeds[i].getPriceNoOlderThan(60)?.expo))
    }
    setPriceFeedList(tempt)
  }

  const fetchUserBalance = async () => {
    aptos.getAccountCoinsData({
      accountAddress: account?.address as any,
    }).then((d: any) => {
      let tempt = {} as any
      for (let i = 0; i < d.length; i++) {
        tempt[d[i].asset_type] = d[i].amount / Math.pow(10, d[i].metadata.decimals)
      }
      setUserBalance(tempt)
    })
  }

  const fetchgetVaultAssets = async () => {
    const payload: InputViewFunctionData = {
      function: `${moduleAddress}::vault::get_vault_assets`,
      typeArguments: [],
      functionArguments: [params.getAll("symbol")[0]],
    };
    const list = await aptos.view({ payload }) as any
    let tempt = {} as any
    let array = [] as any
    for (let i = 0; i < list[0].length; i++) {
      let tmpt = {} as any
      let it = list[0][i]
      tmpt.value = list[0][i].pyth_identity
      tmpt.label = <div style={{
        display: "flex"
      }}>
        {it.symbol}
        <img src={supportedToken[it.pyth_identity].logo} alt="logo" width={20} height={20}
          style={{
            marginLeft: "4px",
            marginRight: "6px"
          }} />
        {it.vault_balance / Math.pow(10, it.decimals)} (${Number(priceFeedList[it.pyth_identity] * it.vault_balance / Math.pow(10, it.decimals)).toFixed(2)} USD)
      </div>
      array.push(tmpt)
      tempt[list[0][i].pyth_identity] = list[0][i].vault_balance / Math.pow(10, list[0][i].decimals)
      tempt.disabled = false
    }
    setVaultBalanceMap(tempt)
    setVaultAssets(list[0])
    setCheckBoxOptions(array)
  }

  const fetchUserHoldUsd = async () => {
    const payload: InputViewFunctionData = {
      function: `${moduleAddress}::shares_fa_coin::balance`,
      typeArguments: [],
      functionArguments: [params.getAll("symbol")[0], account?.address],
    };
    const share = await aptos.view({ payload }) as any
    const payload_: InputViewFunctionData = {
      function: `${moduleAddress}::shares_fa_coin::supply`,
      typeArguments: [],
      functionArguments: [params.getAll("symbol")[0]],
    };
    const nav = await aptos.view({ payload: payload_ }) as any
    setUserHoldUsd(aum / (Number(nav[0].vec[0]) / 100000000) * (Number(share[0]) / 100000000))
  }
  const fetchHoldList = async (address: string) => {
    const payload: InputViewFunctionData = {
      function: `${moduleAddress}::shares_fa_coin::balance`,
      typeArguments: [],
      functionArguments: [params.getAll("symbol")[0], address],
    };
    const share = await aptos.view({ payload }) as any
    const payload_: InputViewFunctionData = {
      function: `${moduleAddress}::shares_fa_coin::supply`,
      typeArguments: [],
      functionArguments: [params.getAll("symbol")[0]],
    };
    const nav = await aptos.view({ payload: payload_ }) as any
    return { usd: aum / (Number(nav[0].vec[0]) / 100000000) * (Number(share[0]) / 100000000), share: (Number(share[0]) / 100000000) }
  }
  const fetchVaultSupportedAssets = async () => {
    const payload: InputViewFunctionData = {
      function: `${moduleAddress}::vault::get_vault_supported_assets`,
      typeArguments: [],
      functionArguments: [],
    };
    const list = await aptos.view({ payload }) as any
    setTokens(list[0])
  }

  const fetchEventsList = async () => {
    let activities = [] as Array<any>
    const Deposit = `
    query MyQuery {
      events(
        where: {indexed_type: {_eq: "${moduleAddress}::vault::Deposit"}}
      ) {
        indexed_type
        data
      }
    }
  `;
    const Withdraw = `
    query MyQuery {
      events(
        where: {indexed_type: {_eq: "${moduleAddress}::vault::Withdraw"}}
      ) {
        indexed_type
        data
      }
    }
  `;
    const Swap = `
    query MyQuery {
      events(
        where: {indexed_type: {_eq: "${moduleAddress}::vault::Swap"}}
      ) {
        indexed_type
        data
      }
    }
  `;
    // 发送 GraphQL 请求
    await fetch('https://api.testnet.aptoslabs.com/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: Withdraw }),
    })
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.data.events.length; i++) {

          let tempt = {} as any
          tempt.operation = "Withdraw"
          tempt.withdrawer = data.data.events[i].data.withdrawer
          tempt.vault_symbol = data.data.events[i].data.vault_symbol
          tempt.shares_num = data.data.events[i].data.burned_shares / Math.pow(10, data.data.events[i].data.burned_shares_decimal)
          tempt.usds = data.data.events[i].data.eq_usd / Math.pow(10, data.data.events[i].data.eq_usd_decimal)
          tempt.created_time = data.data.events[i].data.created_time
          activities.push(tempt)
        }
        // setActiveList(activities)
      })
    await fetch('https://api.testnet.aptoslabs.com/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: Deposit }),
    })
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.data.events.length; i++) {
          let tempt = {} as any
          tempt.operation = "Deposit"
          tempt.coin_type = data.data.events[i].data.coin_type
          tempt.vault_symbol = data.data.events[i].data.vault_symbol
          tempt.depositor = data.data.events[i].data.depositor
          tempt.amount = data.data.events[i].data.amount / Math.pow(10, data.data.events[i].data.amount_decimal)
          tempt.sharesReceived = data.data.events[i].data.minted_shares / Math.pow(10, data.data.events[i].data.minted_shares_decimal)
          tempt.created_time = data.data.events[i].data.created_time
          activities.push(tempt)
        }
        // setActiveList(activities)
      })
    await fetch('https://api.testnet.aptoslabs.com/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: Swap }),
    })
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.data.events.length; i++) {
          let tempt = {} as any
          tempt.operation = "Swap"
          tempt.from_coin_type = data.data.events[i].data.from_coin_type
          tempt.vault_symbol = data.data.events[i].data.vault_symbol
          tempt.from_amount = data.data.events[i].data.from_amount / Math.pow(10, supportedToken[data.data.events[i].data.from_coin_type].decimals)
          tempt.to_coin_type = data.data.events[i].data.to_coin_type
          tempt.to_amount = data.data.events[i].data.to_amount / Math.pow(10, supportedToken[data.data.events[i].data.to_coin_type].decimals)
          tempt.created_time = data.data.events[i].data.created_time
          tempt.swapper = data.data.events[i].data.swapper
          activities.push(tempt)
        }

      })
    let f = activities.filter((it) => it.vault_symbol === params.getAll("symbol")[0])
    f.sort((a, b) => b.created_time - a.created_time)
    setActiveList(f)
    cloneActiveList.current = f
  }

  const fetchVultInfo = async () => {
    const payload: InputViewFunctionData = {
      function: `${moduleAddress}::vault::get_vault_info`,
      typeArguments: [],
      functionArguments: [params.getAll("symbol")[0]],
    };
    const info = await aptos.view({ payload }) as any
    let array = []
    for (let i = 0; i < info[0].holders.length; i++) {
      let tempt = {} as any
      tempt.userAddress = info[0].holders[i].holder
      let { usd, share } = await fetchHoldList(info[0].holders[i].holder)
      tempt.usd = usd
      tempt.share = share
      tempt.proportion = ((usd / aum) * 100).toFixed(2) + "%"
      array.push(tempt)
    }
    setHolders([...array])
    setVaultInfo(info[0])
    setVaultCreateTime(info[0].created_time)
  }

  const refreshPageData = () => {
    fetchUserBalance()
    fetchPriceFeed()
    fetchgetVaultAssets()
    fetchVaultSupportedAssets()
    fetchVultInfo()
    fetchEventsList()
  }

  useEffect(() => {
    if (account) {
      fetchUserBalance()
      fetchUserHoldUsd()
    }
  }, [account, aum])

  useEffect(() => {
    fetchEventsList()
    fetchPriceFeed()
    fetchVaultSupportedAssets()

  }, [])

  useEffect(() => {
    if (JSON.stringify(priceFeedList) === "{}") return
    fetchgetVaultAssets()
  }, [priceFeedList])

  useEffect(() => {
    let num = 0
    for (let i = 0; i < vaultAssets.length; i++) {
      if (priceFeedList[vaultAssets[i].pyth_identity]) {
        num = num + (priceFeedList[vaultAssets[i].pyth_identity] * vaultBalanceMap[vaultAssets[i].pyth_identity])
      }
    }
    setAum(num)
  }, [vaultAssets])
  useEffect(() => {
    fetchVultInfo()
  }, [aum])
  const swapModalDom = {
    "swap": <>
      <SwapPage confirmTransactionEvt={swapEvt} calculatePriceFuc={calculatePriceFuc} vaultBalanceMap={vaultBalanceMap} priceFeedList={priceFeedList} />
    </>,
    "loading": <div style={{
      width: "100%",
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}><Spin></Spin></div>,
    "success": <>{swapModalState.msg}</>,
    "error": <>{swapModalState.msg}</>
  }
  return (
    <>
      <Modal open={swapModalOpen}
        okButtonProps={{
          style: {
            display: "none"
          }
        }}
        cancelButtonProps={{
          style: {
            display: "none"
          }
        }}
        closeIcon={!(swapModalState.state === "loading")}
        onCancel={() => {
          if (swapModalState.state === "loading" || swapModalState.state === "success" || swapModalState.state === "error") {
            setSwapModalState({ state: "swap", msg: "" })
            setSwapModalOpen(false)
            return
          }
          setSwapModalOpen(false)
        }}
      >
        {swapModalDom[swapModalState.state]}
      </Modal>
      <Modal maskClosable={false} open={investModal}
        okButtonProps={{
          disabled: investAmount === 0,
          style: {
            display: investModalState.state === "loading" ? "none" : ""
          }
        }}
        cancelButtonProps={{
          style: {
            display: "none"
          }
        }}
        closeIcon={!(investModalState.state === "loading")}
        onCancel={() => {
          setInvestModalStateFuc()
        }}
        onOk={() => {
          if (investModalState.state === "success" || investModalState.state === "error") {
            setInvestModalStateFuc()
            return
          }
          investEvt()
        }}
      >
        {investStatusDom[investModalState.state]}
      </Modal>
      <Modal maskClosable={false} open={reddeemModal}
        onCancel={() => {
          setReddeemModal(false)
        }}
        onOk={() => {
          if (reddeemModalState.state === "loading" || reddeemModalState.state === "success" || reddeemModalState.state === "error") {
            setReddeemModalState({ state: "reddeem", msg: "" })
            setReddeemModal(false)
            return
          }
          withdrawFuc()
        }}
        cancelButtonProps={{
          style: {
            display: "none"
          },
        }}
        closeIcon={!(reddeemModalState.state === "loading")}
        okButtonProps={{
          disabled: withdrawNum === 0,
          style: {
            display: reddeemModalState.state === "loading" ? "none" : ""
          }
        }}
      >
        {reddeemModalDom[reddeemModalState.state]}
      </Modal>
      <div className={classes.detailsPageContainer}>
        <div className={classes.backArea}>
          <ArrowLeftOutlined
            style={{
              fontSize: "20px",
              color: "var(--text-third-color)",
              cursor: "pointer",
              marginRight: "16px",
            }}
            onClick={() => navigate(-1)}
          />
          <span
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              color: "var(--text-third-color)",
            }}
          >
            Fund Detail
          </span>
        </div>
        <div className={classes.detailsHeadedr}>
          <div className={classes.dedtailsHeaderLeft}>
            <div style={{
              display: "flex"
            }}
            >
              <div className={classes.fundName}>
                {vaultInfo.name}
              </div>
              <div className={classes.walletAddrAera}
                onClick={() => {
                  window.open("https://explorer.aptoslabs.com/account/" + params.getAll("vaultAddress")[0] + "/transactions?network=testnet")
                }}
              >
                <span className={classes.walletAddr}
                  style={{
                    marginLeft: "4px"
                  }
                  }>
                  {params.getAll("vaultAddress")[0]}
                  <img style={{
                    marginLeft: "4px"
                  }} src={imge} width={14} height={14} alt="" />
                </span>
              </div>
            </div>
            <div className={classes.walletAddrAera}>
              <span className={classes.walletAddr}
                onClick={() => {
                  window.open("https://explorer.aptoslabs.com/account/" + vaultInfo.creator + "/transactions?network=testnet")
                }}
              >{vaultInfo.creator} <img src={imge} width={14} height={14} alt="" /></span>
              <span className={classes.ownerSpan}>Fund Creator & Manager</span>
            </div>
          </div>
          <div className={classes.dedtailsHeaderRight}>
            <div
              className="switchNetworksBtn"
              onClick={async () => {
                setInvestModal(true)
                fetchUserBalance()
              }}
            >
              <VerticalAlignBottomOutlined />
              <span className={classes.headerRightTitle}>Invest</span>
            </div>
            <div
              style={{
                marginRight: "6px",
                marginLeft: "6px",
              }}
              className={"switchNetworksBtn"}
              onClick={async () => {
                setReddeemModal(true)
              }}
            >
              <VerticalAlignTopOutlined />
              <span className={classes.headerRightTitle}>Reddeem</span>
            </div>
            <div
              className={vaultInfo.creator === account?.address ? "switchNetworksBtn" : "disabled"}
              onClick={async () => {
                if (vaultInfo.creator !== account?.address) return
                setSwapModalOpen(true)
              }}
            >
              <SwapOutlined />
              <span className={classes.headerRightTitle}>Swap</span>
            </div>
          </div>
        </div>
        <div className={classes.card_area}>
          <div className={classes.info_card}>
            <div className={classes.infoCardValue}>
              {aum ? Number(aum).toFixed(2) : 0}
            </div>
            <div className={classes.infoCardTitle}>AUM(USD)</div>
          </div>
          <div className={classes.info_card}>
            <div className={classes.infoCardValue}>{vaultInfo.holders ? vaultInfo.holders.length : 0}</div>
            <div className={classes.infoCardTitle}>Investor</div>
          </div>
          <div className={classes.info_card}>
            <div className={classes.infoCardValue}>
              <Tokenimg tokens={tokens} />
              <div className={classes.assetLogo}>
              </div>
            </div>
            <div className={classes.infoCardTitle}>Supported Tokens</div>
          </div>
          <div className={classes.info_card}>
            <div className={classes.infoCardValue}>
              {getTimeDifference(Number(vaultCreateTime) * 1000)}
            </div>
            <div className={classes.infoCardTitle}>Since Inception</div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" items={items} />
      </div >
    </>
  );
};

export default DetailsPage;

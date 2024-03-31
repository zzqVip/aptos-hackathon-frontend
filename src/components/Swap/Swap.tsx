import React, { useState, createContext, useContext, useEffect } from "react";
import { Button, InputNumber, Avatar, Modal, Input, List } from "antd";
import { ArrowDownOutlined, DownOutlined, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import supportedToken from '../../../supportedToken.json'
import classes from './style.module.less'
interface Coin {
    name: string;
    symbol: string;
    pythAddress: string;
}

interface UserHold {
    name: string;
    symbol: string;
    amount: number;
}

interface Props {
    supportSellList: [];
    supportBuyList: [];
    userHoldList: {};
    priceFeedList: {};
    confirmTransactionEvt: (sellToken: any, buyToken: any, sellAmount: any) => void;
    calculatePriceFuc: (sellToken: string, buyToken: string, changeAmount: number, changeType: string) => Promise<any>;
}
export type ModalType = 'sell' | 'buy' | ''

const ModalTypeContext = createContext(null);

/**
 * @version 0.1
 * @param  supportSellList  支持出售的列表
 * @param  supportBuyList  支持购买的列表
 * @param  userHoldList     用户持有列表
 * @param  confirmTransactionEvt 确认交易事件
 * @param  calculatePriceFuc 计算兑换比列
 * @returns Swap组件
 */
const Swap: React.FC<Props> = ({ supportSellList, supportBuyList, userHoldList, confirmTransactionEvt, calculatePriceFuc, priceFeedList }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [modalList, setModalList] = useState([])
    const [modalType, setModalType] = useState("" as ModalType)
    const [sellToken, setSellToken] = useState({ name: "APT", symbol: "APT", pythAddress: "0x44a93dddd8effa54ea51076c4e851b6cbbfd938e82eb90197de38fe8876bb66e" } as Coin)
    const [buyToken, setBuyToken] = useState({ name: "", symbol: "" } as Coin)
    const [sellAmount, setSellAmount] = useState(0)
    const [buyAmount, setBuyAmount] = useState(0)
    const [confirmState, setConfirmState] = useState({ status: true, text: "Choose Token" })
    const [swapObjAmount, setSwapObjAmount] = useState({ sellAmount: 0, buyAmount: 0 })
    /** @description 交换出售和购买的Token  */
    const exchangeEvt = () => {
        setSellToken(buyToken)
        setSellAmount(buyAmount)
        setBuyToken(sellToken)
        setBuyAmount(sellAmount)
    }

    /**
     * @description 设置按钮是否可以点击,按钮显示文本
     * */
    const setConfirmBtnStateFuc = () => {
        if (sellToken.name === "" || buyToken.name === "") {
            setConfirmState({ status: true, text: "Choose Token" })
            return
        }
        if (userHoldList[sellToken.pythAddress] < swapObjAmount.sellAmount) {
            setConfirmState({ status: true, text: "Please enter the correct sieze" })
            return
        }
        if (swapObjAmount.sellAmount === 0 || swapObjAmount.buyAmount === 0) {
            setConfirmState({ status: true, text: "Please enter the correct sieze" })
            return
        }
        setConfirmState({ status: false, text: "Confirm" })
    }
    useEffect(() => {
        setConfirmBtnStateFuc()
    }, [swapObjAmount])
    useEffect(() => {
        if (sellToken.name === "" || buyToken.name === "") return;
        if (sellAmount === 0 || !sellAmount) return;
        calculatePriceFuc(sellToken.pythAddress, buyToken.pythAddress, sellAmount, 'sell').then(d => {
            setSwapObjAmount({ sellAmount: sellAmount, buyAmount: d })
        })
    }, [sellToken, buyToken, sellAmount])

    useEffect(() => {
        if (buyToken.name === "" || sellToken.name === "") return;
        if (buyAmount === 0 || !buyAmount) return;
        calculatePriceFuc(sellToken.pythAddress, buyToken.pythAddress, buyAmount, 'buy').then(d => {
            // setSwapObjAmount({ ...swapObjAmount, sellAmount: d })
            setSwapObjAmount({ sellAmount: d, buyAmount: buyAmount })
        })
    }, [sellToken, buyToken, buyAmount])
    return <ModalTypeContext.Provider value={modalType as any}>
        <TokenListModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            modalList={modalList}
            setSellToken={setSellToken}
            setBuyToken={setBuyToken}
            sellToken={sellToken}
            buyToken={buyToken}
            exchangeEvt={exchangeEvt}
            userHoldList={userHoldList}
            priceFeedList={priceFeedList}
        />
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: "26px"
        }}>
            <InputNumber
                placeholder="0.00"
                controls={false}
                min={0}
                value={swapObjAmount.sellAmount}
                onChange={(v: any) => {
                    setSellAmount(v)
                }}
                addonAfter={<Button
                    style={{
                        display: "flex",
                        alignItems: "center"
                    }}
                    onClick={() => {
                        setModalList(supportBuyList)
                        setModalType("sell")
                        setModalOpen(true)
                    }}
                > {sellToken.name ?
                    <div style={{
                        display: "flex",
                        alignItems: "center"
                    }}>{sellToken.name}
                        <img src={supportedToken[sellToken.pythAddress].logo} width={24} height={24} alt="logo"
                            style={{
                                marginLeft: "4px"
                            }}
                        />
                    </div> : "Choose Token"} </Button >
                }
            />
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                color: "#76808f",
                marginTop: "16px"
            }}>
                <div>
                    ${userHoldList[sellToken.pythAddress] ? (userHoldList[sellToken.pythAddress] * priceFeedList[sellToken.pythAddress]).toFixed(8) : 0}
                </div>
                <div>
                    Amount:{userHoldList[sellToken.pythAddress] ? userHoldList[sellToken.pythAddress] : 0} <span onClick={() => {
                        setSellAmount(userHoldList[sellToken.pythAddress])
                    }}
                        style={{
                            cursor: "pointer",
                            color: "#50f6bf"
                        }}>Max</span>
                </div>
            </div>
            <div className={classes.swapPanelDownArrowArea} onClick={() => exchangeEvt()}>
                <ArrowDownOutlined
                    style={{
                        fontSize: "14px",
                        color: "var(--text-third-color)",
                    }}
                />
            </div>
            <InputNumber
                placeholder="0.00"
                controls={false}
                min={0}
                value={swapObjAmount.buyAmount}
                onChange={(v: any) => {
                    setBuyAmount(v)
                }}
                addonAfter={<Button
                    style={{
                        display: "flex",
                        alignItems: "center"
                    }}
                    onClick={() => {
                        setModalList(supportSellList)
                        setModalType("buy")
                        setModalOpen(true)
                    }}
                >{buyToken.name ? <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>{buyToken.name}
                    <img src={supportedToken[buyToken.pythAddress].logo} width={24} height={24} alt="logo"
                        style={{
                            marginLeft: "4px"
                        }}
                    />
                </div> : "Choose Token"}</Button>}
            />
            <Button
                style={{
                    marginTop: "20px"
                }}
                disabled={confirmState.status}
                onClick={() => {
                    confirmTransactionEvt(sellToken, buyToken, sellAmount)
                }}>
                {confirmState.text}
            </Button>
        </div>
    </ModalTypeContext.Provider >
}

/**
 * @description Modal框-选择出售或者购买的Token列表
 * @returns  出售 | 购买的Itmes (sellToken, buyToken)
 */
const TokenListModal = ({ modalOpen, setModalOpen, modalList, setSellToken, setBuyToken, sellToken, buyToken, exchangeEvt, userHoldList, priceFeedList }: any) => {
    const modalType = useContext(ModalTypeContext)
    return <>
        <Modal open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => setModalOpen(false)} >
            <List
                dataSource={modalList}
                renderItem={(item: any) => {
                    return <>
                        <List.Item
                            key={item.name}
                            // className="cursor-pointer"
                            style={{
                                // pointerEvents: "none",
                                cursor: item.name === "ETH" || item.name === "USDC" ? "not-allowed" : "pointer",

                            }}
                            onClick={() => {
                                if (item.name === "ETH" || item.name === "USDC") return
                                if (modalType === 'sell') {
                                    if (item.name === buyToken.name) {
                                        exchangeEvt()
                                    } else {
                                        setSellToken(item)
                                    }
                                } else {
                                    if (item.name === sellToken.name) {
                                        exchangeEvt()
                                    } else {
                                        setBuyToken(item)
                                    }
                                }
                                setModalOpen(false)
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={supportedToken[item.pythAddress].logo}
                                    />
                                }
                                title={
                                    <>
                                        <div style={{
                                            display: "flex",
                                        }}>
                                            <div>
                                                <div>{(item.name)}{userHoldList[item.pythAddress] && ":"}</div>
                                                <div className={classes.swapLabel}>
                                                    {(item.symbol)}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                color: "var(--text-third-color)",
                                                marginLeft: "var(--margin-xs)"
                                            }}>
                                                {userHoldList[item.pythAddress] && <> {userHoldList[item.pythAddress]} (${(userHoldList[item.pythAddress] * priceFeedList[item.pythAddress]).toFixed(8)} USD)</>}
                                            </div>
                                        </div>

                                    </>
                                }
                            />
                        </List.Item >
                    </>
                }}
            />
        </Modal >
    </>
}

export default Swap
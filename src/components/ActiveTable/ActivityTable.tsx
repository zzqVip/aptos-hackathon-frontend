import classes from './style.module.less'
import { Avatar } from "antd"
import shareIcon from '../../assets/icon/share.png'
import { Tooltip } from 'antd'
import dayjs from "dayjs";
import token from '../../../supportedToken.json'
import cbiLogo from '../../assets/logo/cbi_logo.png'
function cutAndConcat(str: String) {
    if (str.length < 12) {
        return "字符串长度不足，无法切割和拼接";
    }
    var front = str.substring(0, 6);
    var end = str.substring(str.length - 6);
    return front + "..." + end;
}

/**
 * @description props time(时间戳), show(是否需要时分秒，默认开启)
 * @returns 格式化后的时间
 */
const FormatTime = (props: any) => {
    const { time, show = true } = props;
    if (show) {
        return (
            <>
                <div>
                    {time === "-"
                        ? "-"
                        : dayjs(time)
                            .locale("en")
                            .format("D MMMM YYYY, HH:mm:ss")
                    }
                </div>
            </>
        );
    } else {
        return (
            <>
                <div>
                    {time === "-"
                        ? "-"
                        : dayjs(time)
                            .locale("en")
                            .format("D MMMM YYYY")
                    }
                </div>
            </>
        );
    }
};
const ShareImg = ({ onClick }: any) => {
    return <img src={shareIcon} width={15} height={15} alt="Block"
        style={{
            marginLeft: "5px",
            cursor: "pointer",
        }}
        onClick={() => {
            onClick()
        }}
    />
}
export function splitString(inputString: string) {
    if (inputString.length < 10) {
        // 如果输入的字符串长度不足10个字符，你可能需要进行错误处理或者返回原始字符串
        return inputString;
    }
    const frontPart = inputString.slice(0, 6);
    const backPart = inputString.slice(-4);
    return `${frontPart}...${backPart}`;
}
const ActivityTable = ({ activityList, vaultInfo }: any) => {
    return <>
        <div>
            {activityList.map((item: any) => {
                return <div key={item.id}>
                    <div className={classes.activeCardBox}>
                        <div className={classes.left}>
                            <div className={classes.leftTop}>
                                <div className={classes.leftItemBox} >
                                    <FormatTime time={item.created_time * 1000} />
                                </div>
                                {/* Type */}
                                <div className={classes.actionType}>
                                    {item.operation}
                                </div>
                            </div>
                            <div className={classes.leftBottom}>
                                <div>
                                    {vaultInfo.name}
                                </div>
                                <div className={classes.leftItemBox} >
                                    <span
                                        onClick={() => {
                                            window.open("https://explorer.aptoslabs.com/account/" + vaultInfo.vault_address + "/transactions?network=testnet")
                                        }}
                                        style={{
                                            cursor: "pointer"
                                        }}>{splitString(vaultInfo.vault_address)}</span> <img src={shareIcon} width={15} height={15} alt="Block"
                                            style={{
                                                marginLeft: "5px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                window.open("https://explorer.aptoslabs.com/account/" + vaultInfo.vault_address + "/transactions?network=testnet")
                                            }}
                                    />
                                </div>
                            </div>
                        </div>
                        {item.operation === "Swap" &&
                            <div className={classes.right}>
                                {/* outgoingAsset */}
                                <div className={classes.rightItem}>
                                    <div>
                                        Protocol
                                    </div>
                                    <div className={classes.cardRightInfo}>
                                        Pontem  <Avatar className={classes.avatar} src={`https://assets-global.website-files.com/60536b901b879c2f395d75d0/65a10477336cd98a7fa4349b_app-icon-liquidswap%20(1).svg`} />
                                    </div>
                                </div>
                                {/* outgoingAsset */}
                                <div className={classes.rightItem}>
                                    <div>
                                        Outgoing Asset

                                    </div>
                                    <div className={classes.cardRightInfo}>
                                        {Number(item.from_amount)}{token[item.from_coin_type].name} <Avatar className={classes.avatar} src={token[item.from_coin_type].logo} />
                                    </div>
                                </div>
                                {/*incomingAsset*/}
                                <div className={classes.rightItem}>
                                    <div>
                                        Shares Received
                                    </div>
                                    <div>
                                        {Number(item.to_amount)} {token[item.to_coin_type].name} <Avatar className={classes.avatar} src={token[item.to_coin_type].logo} />
                                    </div>
                                </div>
                                {/* Depositor  */}
                                <div className={classes.rightItem}>
                                    <div>
                                        Depositor
                                    </div>
                                    <div>
                                        {splitString(item.swapper)}
                                        <ShareImg
                                            onClick={() => {
                                                window.open("https://explorer.aptoslabs.com/account/" + item.swapper + "/transactions?network=testnet")
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                        {item.operation === "Withdraw" && <div className={classes.right}>
                            {/* outgoingAsset */}
                            <div className={classes.rightItem}>
                                <div>
                                    Amount
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {/* title={toolTipText(item.canister_ids, item.amounts, item.eq_usds)} */}
                                    <Tooltip placement="topLeft" >
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            {item.usds}
                                            <span style={{
                                                marginLeft: "5px"
                                            }}>
                                                {"USD"}
                                            </span>
                                            {/* <Avatar className={classes.avatar} src={"https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661"} /> */}
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                            {/*incomingAsset*/}
                            <div className={classes.rightItem}>
                                <div>
                                    {item.operation === "Withdraw" ? "Shares Redeemed" : "Shares  Received"}
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {item.shares_num}
                                </div>
                            </div>
                            {/*Withdraw  */}
                            <div className={classes.rightItem}>
                                <div>
                                    Operator
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {cutAndConcat(item.withdrawer)}
                                    <ShareImg
                                        onClick={() => {
                                            window.open("https://explorer.aptoslabs.com/account/" + item.withdrawer + "/transactions?network=testnet")
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        }
                        {item.operation === "Deposit" && <div className={classes.right}>
                            {/* outgoingAsset */}
                            <div className={classes.rightItem}>
                                <div>
                                    Amount
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {item.amount}
                                    <span style={{
                                        marginLeft: "5px"
                                    }}> {token[item.coin_type].symbol}</span>
                                    <Avatar className={classes.avatar} src={token[item.coin_type].logo} />
                                </div>
                            </div>
                            {/*incomingAsset*/}
                            <div className={classes.rightItem}>
                                <div>
                                    {item.operation === "Redemption" ? "Shares Redeemed" : "Shares  Received"}
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {item.sharesReceived}   <img alt="icon" className={classes.avatar} src={cbiLogo} />
                                </div>
                            </div>
                            {/*Depositor*/}
                            <div className={classes.rightItem}>
                                <div>
                                    Operator
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {cutAndConcat(item.depositor)}
                                    <ShareImg
                                        onClick={() => {
                                            window.open("https://explorer.aptoslabs.com/account/" + item.depositor + "/transactions?network=testnet")
                                        }}
                                    />
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            })
            }
        </div>
    </>
}

export default ActivityTable;
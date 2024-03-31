import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Table } from "antd";
import shareIcon from '../../../../assets/icon/share.png';
const DepositorTable = ({ DepositorList }) => {
    const ShareImg = ({ onClick }) => {
        return _jsx("img", { src: shareIcon, width: 15, height: 15, alt: "Block", style: {
                marginLeft: "5px",
                cursor: "pointer",
            }, onClick: () => {
                onClick();
            } });
    };
    function cutAndConcat(str) {
        if (str.length < 12) {
            return "字符串长度不足，无法切割和拼接";
        }
        var front = str.substring(0, 6);
        var end = str.substring(str.length - 6);
        return front + "..." + end;
    }
    const columns = [
        {
            title: 'Wallet Address',
            dataIndex: 'userAddress',
            key: 'userAddress',
            render: (text) => {
                return _jsx(_Fragment, { children: _jsxs("div", { style: {
                            cursor: "pointer"
                        }, onClick: () => {
                            window.open("https://explorer.aptoslabs.com/account/" + text + "/transactions?network=testnet");
                        }, children: [cutAndConcat(text), "  ", _jsx(ShareImg, { onClick: () => {
                                    window.open("https://explorer.aptoslabs.com/account/" + text + "/transactions?network=testnet");
                                } })] }) });
            }
        },
        {
            title: 'Shares',
            dataIndex: 'share',
            key: 'share',
            // render: (text: number) => {
            //     return <>{(Number(text) / 100000000)}</>
            // }
        },
        {
            title: 'Proportion',
            dataIndex: 'proportion',
            key: 'proportion',
            // render: (text: number) => {
            //     return <>{(Number(text) / 100000000)}</>
            // }
        },
    ];
    return _jsx(_Fragment, { children: _jsx(Table, { dataSource: DepositorList, columns: columns }) });
};
export default DepositorTable;

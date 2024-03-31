import { Table, Avatar } from "antd";
import classes from "./style.module.less";
import supportedToken from '../../../../../supportedToken.json'
const AssetTable = ({ assetList, priceFeedList }: any) => {
  const columns = [
    {
      title: "Token",
      dataIndex: "pyth_identity",
      key: "1",
      render: (text: any, row: any) => {
        return (
          <div className={classes.denominationAssetColumn}>
            <Avatar
              src={supportedToken[text].logo}
              className={classes.avatar}
            />
            {supportedToken[text].symbol}
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "vault_balance",
      key: "2",
      render: (text: any, row: any) => {
        return <>{Number(text) / Math.pow(10, row.decimals)}</>
      }
    },
    {
      title: "Balance",
      dataIndex: "pyth_identity",
      key: "3",
      render: (text: any, row: any) => {
        return <>${((row.vault_balance / Math.pow(10, row.decimals)) * priceFeedList[text]).toFixed(2)} USD</>
      }
    },
  ];
  return <Table dataSource={assetList} columns={columns} />;
};

export default AssetTable;

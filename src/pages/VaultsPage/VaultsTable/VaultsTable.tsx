import { Table } from "antd";
import { Spin } from "antd";
import classes from "./style.module.less";
import { Link } from "react-router-dom";
import Tokenimg from '../../../components/Tokenimg/Tokenimg'
function cutAndConcat(str: String) {
  if (str.length < 12) {
    return "字符串长度不足，无法切割和拼接";
  }
  var front = str.substring(0, 6);
  var end = str.substring(str.length - 6);
  return front + "..." + end;
}

const VaultsTable = ({ dataSource, loading, tokens }: any) => {
  const columns = [
    {
      title: "Fund Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, row: any) => {
        return <div className={classes.fundNameColumn}>
          {row.name}
          {/* {row.owner === address && <div className={`${classes.myFundTag} myCreateLabel`}>My Fund</div>} */}
        </div>
      },
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (text: string, row: any) => {
        return <>
          <div >
            {row.symbol}
          </div>
        </>
      }
    },
    {
      title: "Supported Tokens",
      dataIndex: "supported_tokens",
      key: "supported_tokens",
      render: () => {
        return (
          <div className={classes.denominationAssetColumn}>
            <Tokenimg tokens={tokens} />
          </div>
        );
      },
    },
    {
      title: "Vault Address",
      dataIndex: "vault_address",
      key: "vault_address",
      render: (canisterId: string, row: any) => {
        return (
          <div className={classes.canisterIdLabel} onClick={() => {
            window.open("https://explorer.aptoslabs.com/account/" + row.vault_address + "/transactions?network=testnet")
          }}>
            {cutAndConcat(row.vault_address)}
          </div>
        );
      },
    },
    {
      title: "creator",
      dataIndex: "creator",
      key: "creator",
      render: (canisterId: string, row: any) => {
        return (
          <div className={classes.canisterIdLabel} onClick={() => {
            window.open("https://explorer.aptoslabs.com/account/" + row.creator + "/transactions?network=testnet")
          }}>
            {cutAndConcat(row.creator)}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, row: any) => {
        return (
          <>
            <Link to={"/details?vaultAddress=" + row.vault_address + "&symbol=" + row.symbol}>
              Detail
            </Link>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Spin spinning={loading} tip="Loading blockchain data...">
        <Table
          dataSource={dataSource}
          rowKey={(record) => record.name}
          columns={columns as any}
          pagination={{
            pageSize: 10,
          }}
        />
      </Spin>
    </>
  );
};

export default VaultsTable;

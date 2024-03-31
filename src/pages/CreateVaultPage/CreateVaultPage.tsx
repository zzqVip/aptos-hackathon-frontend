import { useState } from "react";
import { Input, Button, Modal, Spin, } from "antd";
import { Aptos, AptosConfig, Network, } from "@aptos-labs/ts-sdk";
import classes from "./style.module.less";
import {
  useWallet,
  InputTransactionData,
} from '@aptos-labs/wallet-adapter-react';
import { moduleAddress } from '../../Const/Const'
const rule = /^[a-zA-Z0-9]{3,50}$/;
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);
const CreateVaultPage = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [createObj, setCreateObj] = useState({
    name: "",
    symbol: "",
  });
  const [createModal, setCreateModal] = useState(false);
  const [createStatus, setCreateStatus] = useState({
    status: "create",
    msg: "",
  })
  const [nameStatus, setNameStatus] = useState(true);
  const [symbolStatus, setSymbolStatus] = useState(true);
  const [nameAlreadyExists, setNameAlreadyExists] = useState(false)
  const create = async () => {
    if (createStatus.status === "loading" || createStatus.status === "success" || createStatus.status === "error") {
      setCreateModal(false)
      return
    }
    if (!account) return;
    const transaction: InputTransactionData = {
      data: {
        typeArguments: [],
        function: `${moduleAddress}::vault::create_vault`,
        functionArguments: [createObj.name, createObj.symbol]
      }
    }
    try {
      setCreateStatus({ status: "loading", msg: "" })
      const response = await signAndSubmitTransaction(transaction);
      let result = await aptos.waitForTransaction({ transactionHash: response.hash })
      setCreateStatus({ status: "success", msg: "" })
    } catch (error: any) {
      setCreateStatus({ status: "error", msg: "" })
    } finally {
      setCreateObj({ name: "", symbol: "" })
    }
  };
  return (
    <>
      {
        true ? (
          <div className={classes.createCreateVaultBox}>
            <div className={classes.createCreateInfoBox}>
              <div className={classes.createItem}>
                <div className={classes.title}>Name</div>
                <Input
                  onChange={(e) => {
                    setCreateObj({ ...createObj, name: e.target.value });
                  }}
                  status={!nameStatus || nameAlreadyExists ? "error" : ""}
                  onBlur={(e) => {
                    if (!e.target.value) return;
                    setNameStatus(rule.test(e.target.value));
                  }}
                  value={createObj.name}
                />
                {!nameStatus && (
                  <div
                    style={{
                      color: "#dc4446",
                    }}
                  >
                    Name does not meet the requirements (3-50 characters).
                  </div>
                )}
                {
                  nameAlreadyExists ?
                    <div style={{
                      color: "#dc4446",
                    }}>
                      Name already exists!
                    </div>
                    : ""
                }
              </div>
              <div className={classes.createItem}>
                <div className={classes.title}>Symbol </div>
                <Input
                  onChange={(e) => {
                    setCreateObj({ ...createObj, symbol: e.target.value });
                  }}
                  value={createObj.symbol}
                  status={!symbolStatus ? "error" : ""}
                  onBlur={(e) => {
                    if (!e.target.value) return;
                    setSymbolStatus(rule.test(e.target.value));
                  }}
                />
                {!symbolStatus && (
                  <div
                    style={{
                      color: "#dc4446",
                    }}
                  >
                    Symbol does not meet the requirements (3-50 characters).
                  </div>
                )}
              </div>
              <div className={classes.createItem}>
                {/* <div className={classes.title}>Supported Tokens</div> */}
                {/* {show && <MySelect getSelectTokenArrayFuc={getSelectTokenArrayFuc} />} */}
              </div>
              <div className={classes.createBtn}>
                <Button
                  disabled={
                    createObj.name === "" ||
                    createObj.symbol === "" ||
                    !nameStatus ||
                    !symbolStatus || nameAlreadyExists
                  }
                  onClick={() => {
                    setCreateModal(true);
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={classes.noLoginBox}>
            Please connect wallet
          </div>
        )
      }
      {/*Modal*/}
      <div>
        <Modal
          open={createModal}
          onOk={() => create()}
          onCancel={() => {
            setCreateModal(false);
            setCreateStatus({ ...createStatus, status: "create" })
          }}
          maskClosable={false}
          cancelButtonProps={{
            style: {
              display: createStatus.status == 'loading' || createStatus.status === 'success' ? "none" : "",
            },
          }}
          okButtonProps={{
            style: {
              display: createStatus.status == 'loading' ? "none" : "",
            },
          }}
          closeIcon={false}
          centered
        >
          {createStatus.status === 'create' && (
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Create Active Fund
              </div>
              <div>
                Create a new active fund named {createObj.name} with symbol {createObj.symbol}
              </div>
            </div>
          )}
          {createStatus.status == 'loading' && (
            <div className={classes.createFundSpinContainer}>
              <Spin />
              <div className={classes.spinLoadingText}>
                Creating a active fund...
              </div>
            </div>
          )}
          {createStatus.status === 'success' && (
            <>
              <div className={classes.createModalText}>
                Successfully created a active fund! You can find it in "Invest
                in Fund".
              </div>
            </>
          )}
          {createStatus.status === 'error' && (
            <>
              <div className={classes.createModalText}>
                {createStatus.msg ? createStatus.msg : "created Error!"}
              </div>
            </>
          )}
        </Modal>
      </div >
    </>
  );
};
export default CreateVaultPage;

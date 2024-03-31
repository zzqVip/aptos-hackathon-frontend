import { useEffect, useState } from "react";
import VaultsTable from "./VaultsTable/VaultsTable";
import { Aptos, AptosConfig, InputViewFunctionData, Network } from "@aptos-labs/ts-sdk";
import { moduleAddress } from '../../Const/Const'
const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);
const VaultsPage = () => {
    const [loading, setLoading] = useState(true)
    const [dataSource, setDataSource] = useState([] as any)
    const [tokens, setTokens] = useState([])
    const fetchVaultSupportedAssets = async () => {
        const payload: InputViewFunctionData = {
            function: `${moduleAddress}::vault::get_vault_supported_assets`,
            typeArguments: [],
            functionArguments: [],
        };
        const list = await aptos.view({ payload }) as any


        setTokens(list[0])
    }
    const getVaultList = async () => {
        const payload: InputViewFunctionData = {
            function: `${moduleAddress}::vault::get_vault_list`,
            typeArguments: [],
            functionArguments: [],
        };
        const list = await aptos.view({ payload })
        console.log(list[0], moduleAddress);
        setDataSource(list[0])
        setLoading(false)
    }
    useEffect(() => {
        getVaultList()
        fetchVaultSupportedAssets()
    }, [])
    return <><VaultsTable dataSource={dataSource} loading={loading} tokens={tokens} /></>
}

export default VaultsPage
import { Popover } from "antd";
import React from "react";
import classes from "./style.module.less";
import token from '../../../supportedToken.json'
const content = (tokens: any) => {
    return <>
        {tokens.map((it: any) => {
            return (
                <div className={classes.tokenIconPopoverItem} key={it.pyth_identity}>
                    <img src={token[it.pyth_identity]?.logo} alt="" style={{
                        borderRadius: "9999px",
                    }}
                        className={classes.tokenIconPopoverAvatar}
                    />
                    {token[it.pyth_identity]?.name}({token[it.pyth_identity]?.symbol})
                </div>
            );
        })}
    </>
}
const Tokenimg = ({ tokens }: any) => {
    if (!tokens) return <></>
    return <div style={{
        cursor: "pointer"
    }}>
        <Popover content={content(tokens)} trigger="hover" arrow={false}>
            {tokens.map((it: any) => {
                return <img key={it.pyth_identity} className={classes.avatar} src={token[it.pyth_identity]?.logo} width={24} height={24} alt="" style={{
                    borderRadius: "9999px",
                }} />
            })}
        </Popover>
    </div>
}
export default Tokenimg
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { SoundOutlined } from "@ant-design/icons";
import classes from "./style.module.less";
const SoundNotice = () => {
    return (_jsx(_Fragment, { children: _jsx("div", { className: classes.topNoticeArea, children: _jsxs("a", { href: "https://sim.cbindex.finance", target: "_blank", children: [_jsx(SoundOutlined, { style: { marginRight: "6px" } }), "CBIndex Simulator V2 Beta is now live! We welcome feedback and suggestions!"] }) }) }));
};
export default SoundNotice;

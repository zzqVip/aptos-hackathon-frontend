import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import classes from "./style.module.less";
import logo from '../../../../../assets/icon/cbi_logo.png';
const Logo = () => {
    return (_jsx(_Fragment, { children: _jsx("div", { onClick: () => {
            }, className: classes.logoArea, children: _jsx("img", { src: logo, width: 96, height: 34, alt: "Logo" }) }) }));
};
export default Logo;

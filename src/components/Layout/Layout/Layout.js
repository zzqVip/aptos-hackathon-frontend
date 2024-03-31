import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header/Header";
import classes from "./style.module.less";
import SideBar from "../SideBar/SideBar";
const Layout = ({ children }) => {
    return (_jsxs("div", { className: classes.container, children: [_jsx("div", { className: classes.headerContainer, children: _jsx(Header, {}) }), _jsxs("div", { className: classes.mainContainer, children: [_jsx("div", { className: classes.sidebarMenu, children: _jsx(SideBar, {}) }), _jsxs("div", { className: classes.mainPanel, children: [_jsx("div", { className: classes.mainPanelTopContainer, children: children }), _jsx("div", { className: classes.footerRight, children: _jsx(Footer, {}) })] })] })] }));
};
export default React.memo(Layout);

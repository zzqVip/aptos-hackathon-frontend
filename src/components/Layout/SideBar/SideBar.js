import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import classes from "./style.module.less";
import { Link, useLocation } from "react-router-dom";
const SideBar = ({}) => {
    const location = useLocation();
    const [list, setList] = useState([{
            name: "Invest in Fund",
            url: "/vaults",
            pathname: "/activefund/[...page]",
        },
        {
            name: "Create Fund",
            url: "/createactivefund",
            pathname: "/activefund/[...page]",
        },
    ]);
    const checkColor = (url) => {
        if (location.pathname === '/details' && url === '/vaults') {
            return "#fff";
        }
        if (location.pathname === url) {
            return "#fff";
        }
    };
    return (_jsx(_Fragment, { children: true && (_jsx("div", { className: classes.container, children: _jsx("div", { className: classes.functionArea, children: _jsx("div", { children: list.map((item) => (_jsx(Link, { to: item.url, children: _jsx("div", { style: {
                                color: checkColor(item.url),
                                marginTop: "16px",
                            }, children: item.name }, item.name) }, item.url))) }) }) })) }));
};
export default SideBar;

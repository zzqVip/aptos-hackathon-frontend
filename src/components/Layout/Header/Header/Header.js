import { jsx as _jsx } from "react/jsx-runtime";
import PcHeader from "../PcHeader/PcHeader";
const Header = () => {
    return (_jsx("div", { children: _jsx("div", { className: `${"md:hidden flex"}}`, children: _jsx(PcHeader, {}) }) }));
};
export default Header;

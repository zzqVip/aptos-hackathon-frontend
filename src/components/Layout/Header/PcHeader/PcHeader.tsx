import classes from "./style.module.less";
import Logo from "../Header/Logo/Logo";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import SoundNotice from "../SoundNotice/SoundNotice";
const headerMenuList = [
  {
    key: "/vaults",
    label: "Active Fund",
    pathname: "/activefund/[...page]",
  },
];
import { Link } from "react-router-dom";
const PcHeadr = () => {
  return (
    <div className={classes.container}>
      <div className={classes.headerTopLayer}>
        <SoundNotice />
        {/* right section of the header's top layer */}
        <div className={classes.headerTopLayerRight}>
          {/* localeLanguage */}
          <div className={classes.localeArea}></div>
          {/* token ? profile: LoginBtn */}
          <div className={classes.localeArea}></div>
        </div>
      </div>
      <div className={classes.drawALine}></div>
      {/* Bottom layer of the PC header */}
      <div className={classes.headerBottomLayer}>
        <Logo />
        <div className={classes.menuArea}>
          {/* Menu */}
          <div className={classes.optionArea}>
            {headerMenuList.map((item, index) => {
              return (
                <Link to={item.key} key={item.key}>
                  <div className={classes.optionItem}>
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
          <div>
            <WalletSelector />
          </div>
        </div>
      </div>
    </div >
  );
};
export default PcHeadr;

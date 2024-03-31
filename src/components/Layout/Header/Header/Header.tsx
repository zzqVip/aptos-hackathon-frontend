import PcHeader from "../PcHeader/PcHeader";
const Header = () => {
  return (
    <div>
      <div className={`${"md:hidden flex"}}`}>
        <PcHeader />
      </div>
    </div>
  );
};
export default Header;


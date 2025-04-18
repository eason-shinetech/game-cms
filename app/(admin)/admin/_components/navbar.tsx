import HeaderSideBar from "./header-sidebar";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <HeaderSideBar />
    </div>
  );
};

export default Navbar;

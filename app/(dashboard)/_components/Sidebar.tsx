import Logo from "./Logo";
import Sidebar_routes from "./Sidebar_routes";

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <Sidebar_routes />
      </div>
    </div>
  );
};

export default Sidebar;

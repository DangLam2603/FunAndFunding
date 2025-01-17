import { Outlet } from "react-router";
import Sidenav from "../../components/AdminDashboard/Sidenav";

const AdminDashboardLayout = () => {
  return (
    <>
      <Sidenav />

      <div className="p-4 sm:ml-72">
        <Outlet />
      </div>
    </>
  );
};

export default AdminDashboardLayout;

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout() {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main section */}
            <div className="ml-64 min-h-screen">

                {/* Topbar */}
                <Topbar />

                {/* Page content */}
                <main className="p-8">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

export default DashboardLayout;
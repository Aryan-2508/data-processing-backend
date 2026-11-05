import {
    Search,
    Bell,
    ChevronDown,
    CalendarDays,
} from "lucide-react";

function Topbar() {
    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

            {/* Left section */}
            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    Dashboard Overview
                </h2>
                <p className="text-sm text-slate-500">
                    Welcome back! Here's what's happening with your store.
                </p>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-5">

                {/* Search */}
                <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                    <Search size={20} />
                </button>

                {/* Date */}
                <button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 sm:flex">
                    <CalendarDays size={17} />
                    <span>Today</span>
                    <ChevronDown size={15} />
                </button>

                {/* Notifications */}
                <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                    <Bell size={20} />

                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>

                {/* Profile */}
                <button className="flex items-center gap-3 border-l border-slate-200 pl-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                        AD
                    </div>

                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold text-slate-800">
                            Admin
                        </p>
                        <p className="text-xs text-slate-500">
                            Administrator
                        </p>
                    </div>

                    <ChevronDown size={16} className="text-slate-500" />
                </button>

            </div>
        </header>
    );
}

export default Topbar;
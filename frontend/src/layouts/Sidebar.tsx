import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Package,
    CreditCard,
    ChartNoAxesCombined,
    Settings,
} from "lucide-react";

const navigationItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Orders", icon: ShoppingCart },
    { label: "Customers", icon: Users },
    { label: "Products", icon: Package },
    { label: "Payments", icon: CreditCard },
    { label: "Analytics", icon: ChartNoAxesCombined },
];

function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-white">

            {/* Logo */}
            <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                    <ChartNoAxesCombined size={22} />
                </div>

                <div>
                    <h1 className="text-lg font-bold">InsightPro</h1>
                    <p className="text-xs text-slate-400">Analytics Platform</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
                <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Menu
                </p>

                {navigationItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                                index === 0
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            <Icon size={19} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Settings */}
            <div className="border-t border-slate-800 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
                    <Settings size={19} />
                    Settings
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    description: string;
}

function KPICard({
    title,
    value,
    icon: Icon,
    description,
}: KPICardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                    {title}
                </p>

                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Icon size={20} />
                </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-800">
                {value}
            </h2>

            <p className="mt-2 text-xs text-slate-500">
                {description}
            </p>
        </div>
    );
}

export default KPICard;
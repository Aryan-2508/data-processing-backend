import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./features/dashboard/components/DashboardPage";

function App() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route path="/" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
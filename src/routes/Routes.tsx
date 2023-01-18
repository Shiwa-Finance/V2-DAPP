import { Routes, Route, Navigate } from "react-router-dom";
import loadable from "@loadable/component";

const Migrator = loadable(() => import("../page/Migrator"));
const Dividend = loadable(() => import("../page/Dividend"));

const MigratorComponent = () => {
    return (
        <Migrator />
    );
};

const DividendComponent = () => {
    return (
        <Dividend />
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MigratorComponent />} />
            <Route path="/migrate" element={<MigratorComponent />} />
            <Route path="/reward" element={<DividendComponent />} />
            <Route path="*" element={<Navigate replace={true} to={"/"} />} />
        </Routes>
    );
};

export default AppRoutes;
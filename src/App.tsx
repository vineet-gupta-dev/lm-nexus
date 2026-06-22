import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { RuleEngine } from "./pages/RuleEngine/RuleEngine";
import { AssignmentCenter } from "./pages/Assignments/AssignmentCenter";
import { Contracts } from "./pages/Contracts/Contracts";
import { UserOptimization } from "./pages/UserOptimization/UserOptimization";
import { RoleOptimization } from "./pages/RoleOptimization/RoleOptimization";
import { RoleReplacement } from "./pages/RoleReplacement/RoleReplacement";
import { Compliance } from "./pages/Compliance/Compliance";
import { Simulation } from "./pages/Simulation/Simulation";
import { Chargeback } from "./pages/Chargeback/Chargeback";import { FueLicensing } from './pages/FueLicensing/FueLicensing';
// import { SapTest } from './pages/SapTest/SapTest'; // SAP connection issues - commented out
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="rules" element={<RuleEngine />} />
          <Route path="assignments" element={<AssignmentCenter />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="user-optimization" element={<UserOptimization />} />
          <Route path="role-optimization" element={<RoleOptimization />} />
          <Route path="role-replacement" element={<RoleReplacement />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="chargeback" element={<Chargeback />} />
          <Route path="fue" element={<FueLicensing />} />
          {/* <Route path="sap-test" element={<SapTest />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
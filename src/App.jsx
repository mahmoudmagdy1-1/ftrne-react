import { Routes, Route } from "react-router";
import HomePage from "./pages/Home.jsx";
import NewOrder from "./pages/NewOrder.jsx";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders/new" element={<NewOrder />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

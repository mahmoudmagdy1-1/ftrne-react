import { useState } from "react";
import OrderForm from "../components/OrderForm";
import OrderFilterPerson from "../components/OrderFilterPerson";
import OrderFilterItem from "../components/OrderFilterItem";

const NewOrder = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div>
      <div className="bg-gray-800 rounded-xl h-8 flex">
        <button
          className={`cursor-pointer flex-1 text-white rounded 
            ${activeTab === "tab1" ? "bg-amber-500" : ""}`}
          onClick={() => setActiveTab("tab1")}
        >
          Form
        </button>
        <button
          className={`cursor-pointer flex-1 text-white rounded 
            ${activeTab === "tab2" ? "bg-amber-500" : ""}`}
          onClick={() => setActiveTab("tab2")}
        >
          By Person
        </button>
        <button
          className={`cursor-pointer flex-1 text-white rounded 
            ${activeTab === "tab3" ? "bg-amber-500" : ""}`}
          onClick={() => setActiveTab("tab3")}
        >
          By Item
        </button>
      </div>

      <div>
        <div style={{ display: activeTab === "tab1" ? "block" : "none" }}>
          <OrderForm />
        </div>

        <div style={{ display: activeTab === "tab2" ? "block" : "none" }}>
          <OrderFilterPerson />
        </div>

        <div style={{ display: activeTab === "tab3" ? "block" : "none" }}>
          <OrderFilterItem />
        </div>
      </div>
    </div>
  );
};

export default NewOrder;

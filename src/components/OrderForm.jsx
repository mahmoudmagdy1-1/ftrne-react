import { useState } from "react";
import AddRestaurantModal from "./AddRestaurantModal";

const OrderForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="py-8">
      <form className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-8 items-center">
        <label htmlFor="name" className="text-xl text-right">
          Person Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="border border-white rounded-lg outline-none px-4 py-2 focus:border-amber-900 w-full max-w-md"
        />

        <label htmlFor="restaurant" className="text-xl text-right">
          Choose a restaurant:
        </label>
        <select
          name="cars"
          id="cars"
          onChange={(val) => {
            val.target.value == "new"
              ? setIsModalOpen(true)
              : setIsModalOpen(false);
          }}
          className="border border-white rounded-lg outline-none px-4 py-2 focus:border-amber-900 w-full max-w-md"
        >
          <option value="none">-</option>
          <option value="new">Add a New Restaurant</option>
        </select>
      </form>

      {isModalOpen ? <AddRestaurantModal /> : ""}
    </div>
  );
};

export default OrderForm;

import { useContext } from "react";
import AppDataContext from "../context/AppDataContext";

const OrderFilterItem = () => {
  const { cart } = useContext(AppDataContext);

  if (cart.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-xl">No orders yet.</p>
        <p className="text-sm mt-2">
          Add items in the Form tab to get started!
        </p>
      </div>
    );
  }

  const itemsByRestaurant = {};

  cart.forEach((personOrder) => {
    personOrder.items.forEach((item) => {
      const restaurantName = item.restaurantName;

      if (!itemsByRestaurant[restaurantName]) {
        itemsByRestaurant[restaurantName] = {};
      }

      const itemName = item.name;
      if (!itemsByRestaurant[restaurantName][itemName]) {
        itemsByRestaurant[restaurantName][itemName] = {
          name: itemName,
          price: item.price,
          quantity: 0,
          total: 0,
        };
      }

      itemsByRestaurant[restaurantName][itemName].quantity += item.quantity;
      itemsByRestaurant[restaurantName][itemName].total +=
        item.price * item.quantity;
    });
  });

  return (
    <div className="py-8 space-y-8">
      {Object.entries(itemsByRestaurant).map(([restaurantName, items]) => {
        const restaurantTotal = Object.values(items).reduce(
          (sum, item) => sum + item.total,
          0
        );

        return (
          <div key={restaurantName} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {restaurantName}
              </h2>
              <span className="text-amber-500 font-bold text-xl">
                {restaurantTotal.toFixed(2)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-amber-500">Item</th>
                    <th className="pb-3 text-amber-500">Quantity</th>
                    <th className="pb-3 text-amber-500">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.values(items).map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-800">
                      <td className="py-3 text-gray-300">{item.name}</td>
                      <td className="py-3 text-gray-300">{item.quantity}</td>
                      <td className="py-3 text-amber-500">
                        {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="border-t border-gray-700">
                    <td className="pt-3 text-right text-white font-semibold">
                      Subtotal:
                    </td>
                    <td colSpan="2" className="pt-3 text-amber-500 font-bold">
                      {restaurantTotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      })}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (window.confirm("Complete this order and start a new order?")) {
              localStorage.removeItem("currentCart");
              window.location.reload();
            }
          }}
          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default OrderFilterItem;

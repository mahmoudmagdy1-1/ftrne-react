import { useContext, useState, useMemo } from "react";
import { FaTrash } from "react-icons/fa6";
import AppDataContext from "../context/AppDataContext";

const OrderFilterPerson = () => {
  const { cart, removePersonOrder } = useContext(AppDataContext);

  const groupedByPerson = useMemo(() => {
    const groups = {};

    cart.forEach((personOrder) => {
      const name = personOrder.personName;

      if (!groups[name]) {
        groups[name] = {
          personName: name,
          mergedItems: {},
          orderIds: [],
          subtotal: 0,
        };
      }

      groups[name].orderIds.push(personOrder.id);
      groups[name].subtotal += personOrder.subtotal;

      personOrder.items.forEach((item) => {
        const key = `${item.name}-${item.restaurantName}`;

        if (!groups[name].mergedItems[key]) {
          groups[name].mergedItems[key] = {
            name: item.name,
            restaurantName: item.restaurantName,
            price: item.price,
            quantity: 0,
            total: 0,
            orderIds: [],
          };
        }

        groups[name].mergedItems[key].quantity += item.quantity;
        groups[name].mergedItems[key].total += item.price * item.quantity;
        groups[name].mergedItems[key].orderIds.push(personOrder.id);
      });
    });

    return Object.values(groups).map((group) => ({
      ...group,
      items: Object.values(group.mergedItems),
    }));
  }, [cart]);

  const [paidAmounts, setPaidAmounts] = useState(() => {
    const initial = {};
    groupedByPerson.forEach((group) => {
      initial[group.personName] = group.subtotal.toFixed(2);
    });
    return initial;
  });

  const handlePaidChange = (personName, value) => {
    setPaidAmounts((prev) => ({
      ...prev,
      [personName]: value,
    }));
  };

  const handleRemoveItem = (personName, orderIds) => {
    if (window.confirm(`Remove this item from ${personName}'s order?`)) {
      orderIds.forEach((id) => removePersonOrder(id));

      const remainingOrders = cart.filter(
        (o) => o.personName === personName && !orderIds.includes(o.id)
      );

      if (remainingOrders.length === 0) {
        setPaidAmounts((prev) => {
          const updated = { ...prev };
          delete updated[personName];
          return updated;
        });
      }
    }
  };

  if (groupedByPerson.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-xl">No orders yet.</p>
        <p className="text-sm mt-2">
          Add items in the Form tab to get started!
        </p>
      </div>
    );
  }

  const grandTotal = groupedByPerson.reduce(
    (sum, group) => sum + group.subtotal,
    0
  );
  const totalPaid = Object.values(paidAmounts).reduce(
    (sum, val) => sum + parseFloat(val || 0),
    0
  );

  return (
    <div className="py-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 px-2 sm:px-4 text-amber-500">Person Name</th>
              <th className="pb-3 px-2 sm:px-4 text-amber-500">Item</th>
              <th className="pb-3 px-2 sm:px-4 text-amber-500">Quantity</th>
              <th className="pb-3 px-2 sm:px-4 text-amber-500">Subtotal</th>
              <th className="pb-3 px-2 sm:px-4 text-amber-500">Paid</th>
              <th className="pb-3 px-2 sm:px-4 text-amber-500">Total</th>
              <th className="pb-3 px-2 sm:px-4 text-amber-500">Restaurant</th>
              <th className="pb-3 px-2 sm:px-4 text-amber-500"></th>
            </tr>
          </thead>

          <tbody>
            {groupedByPerson.map((group, personIndex) => (
              <>
                {group.items.map((item, itemIndex) => (
                  <tr
                    key={`${group.personName}-${itemIndex}`}
                    className="border-b border-gray-800"
                  >
                    {itemIndex === 0 && (
                      <td
                        rowSpan={group.items.length}
                        className="py-3 px-2 sm:px-4 align-top text-white"
                      >
                        {group.personName}
                      </td>
                    )}

                    <td className="py-3 px-2 sm:px-4 text-gray-300">
                      {item.name}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-amber-500">
                      {item.total.toFixed(2)}
                    </td>

                    {itemIndex === 0 && (
                      <td
                        rowSpan={group.items.length}
                        className="py-3 px-2 sm:px-4 align-top"
                      >
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={paidAmounts[group.personName] || ""}
                          onChange={(e) =>
                            handlePaidChange(group.personName, e.target.value)
                          }
                          className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-amber-500"
                          placeholder="0.00"
                        />
                      </td>
                    )}

                    <td className="py-3 px-2 sm:px-4"></td>

                    <td className="py-3 px-2 sm:px-4 text-gray-400 text-sm">
                      {item.restaurantName}
                    </td>

                    <td className="py-3 px-2 sm:px-4">
                      <button
                        onClick={() =>
                          handleRemoveItem(group.personName, item.orderIds)
                        }
                        className="p-2 text-red-500 cursor-pointer hover:text-red-400 transition-colors"
                        title="Remove this item"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {group.items.length > 1 && (
                  <tr
                    key={`${group.personName}-subtotal`}
                    className="border-b-2 border-gray-700 bg-gray-800/50"
                  >
                    <td colSpan="3" className="py-2 px-2 sm:px-4"></td>
                    <td className="py-2 px-2 sm:px-4"></td>
                    <td className="py-2 px-2 sm:px-4"></td>
                    <td className="py-2 px-2 sm:px-4 text-amber-500 font-bold">
                      {group.subtotal.toFixed(2)}
                    </td>
                    <td colSpan="2" className="py-2 px-2 sm:px-4"></td>
                  </tr>
                )}

                {personIndex < groupedByPerson.length - 1 && (
                  <tr key={`${group.personName}-spacer`}>
                    <td colSpan="8" className="py-2"></td>
                  </tr>
                )}
              </>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-amber-500">
              <td
                colSpan="3"
                className="pt-4 px-2 sm:px-4 text-right text-white font-bold"
              ></td>
              <td className="pt-4 px-2 sm:px-4 text-amber-500 font-bold">
                {grandTotal.toFixed(2)}
              </td>
              <td className="pt-4 px-2 sm:px-4 text-amber-500 font-bold">
                {totalPaid.toFixed(2)}
              </td>
              <td colSpan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-8 flex justify-end gap-4">
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

export default OrderFilterPerson;

import { useContext, useMemo, useState } from "react";
import AddRestaurantModal from "./AddRestaurantModal";
import AddMenuItemModal from "./AddMenuItemModal";
import AppDataContext from "../context/AppDataContext";
import { FaPlus, FaTrash } from "react-icons/fa6";

const OrderForm = () => {
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const { restaurants, menuItems, addPersonOrder } = useContext(AppDataContext);
  const [personName, setPersonName] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentPersonItems, setCurrentPersonItems] = useState([]);

  const filteredMenuItems = useMemo(() => {
    if (
      !selectedRestaurantId ||
      selectedRestaurantId === "none" ||
      selectedRestaurantId === "new"
    ) {
      return [];
    }
    return menuItems.filter(
      (item) => String(item.restaurantId) === String(selectedRestaurantId)
    );
  }, [selectedRestaurantId, menuItems]);

  const isItemsEnabled =
    selectedRestaurantId &&
    selectedRestaurantId !== "new" &&
    selectedRestaurantId !== "none" &&
    personName.length > 0;

  const isAddButtonEnabled =
    isItemsEnabled &&
    selectedMenuItem &&
    selectedMenuItem !== "new" &&
    quantity > 0;

  const handleAddItem = () => {
    if (!selectedMenuItem || selectedMenuItem === "new") return;

    const menuItem = menuItems.find(
      (item) => String(item.id) === String(selectedMenuItem)
    );
    const restaurant = restaurants.find(
      (r) => String(r.id) === String(selectedRestaurantId)
    );

    if (!menuItem) return;

    const newItem = {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: parseFloat(menuItem.price),
      quantity: parseInt(quantity),
      restaurantName: restaurant?.name || "Unknown",
    };

    const existingItemIndex = currentPersonItems.findIndex(
      (item) => item.menuItemId === newItem.menuItemId
    );

    if (existingItemIndex >= 0) {
      setCurrentPersonItems((prev) =>
        prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      );
    } else {
      setCurrentPersonItems((prev) => [...prev, newItem]);
    }

    setSelectedMenuItem("");
    setQuantity(1);
  };

  const handleRemoveItem = (menuItemId) => {
    setCurrentPersonItems((prev) =>
      prev.filter((item) => item.menuItemId !== menuItemId)
    );
  };

  const handleSubmitPersonOrder = () => {
    if (currentPersonItems.length === 0 || !personName) return;

    addPersonOrder(personName, currentPersonItems);

    setPersonName("");
    setSelectedRestaurantId("");
    setSelectedMenuItem("");
    setQuantity(1);
    setCurrentPersonItems([]);

    alert(`${personName}'s order added successfully!`);
  };

  const currentSubtotal = currentPersonItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <form
        className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-6 items-center bg-gray-800 p-8 rounded-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="name" className="text-xl text-right text-white">
          Person Name:
        </label>
        <input
          type="text"
          id="name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Enter person's name"
          className="border border-white rounded-lg outline-none px-4 py-2 focus:border-amber-900 w-full bg-gray-700 text-white"
        />

        <label htmlFor="restaurant" className="text-xl text-right text-white">
          Choose a restaurant:
        </label>
        <select
          id="restaurant"
          value={selectedRestaurantId}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedRestaurantId(value);
            setSelectedMenuItem("");

            if (value === "new") {
              setIsRestaurantModalOpen(true);
            }
          }}
          className="border border-white rounded-lg outline-none px-4 py-2 focus:border-amber-900 w-full bg-gray-700 text-white"
        >
          <option value="none">-</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
          <option value="new">+ Add a New Restaurant</option>
        </select>

        <label htmlFor="menuItems" className="text-xl text-right text-white">
          Choose Items:
        </label>
        <select
          id="menuItems"
          value={selectedMenuItem}
          disabled={!isItemsEnabled}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "new") {
              setIsMenuItemModalOpen(true);
            } else {
              setSelectedMenuItem(value);
            }
          }}
          className="border border-white rounded-lg outline-none px-4 py-2 focus:border-amber-900 w-full bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">-</option>
          {filteredMenuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - {parseFloat(item.price).toFixed(2)}
            </option>
          ))}
          {selectedRestaurantId &&
            selectedRestaurantId !== "none" &&
            selectedRestaurantId !== "new" && (
              <option value="new">+ Add New Item</option>
            )}
        </select>

        <label htmlFor="quantity" className="text-xl text-right text-white">
          Quantity:
        </label>
        <div className="flex items-center justify-between gap-4">
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            disabled={!isItemsEnabled}
            className="border border-white rounded-lg outline-none px-4 py-2 focus:border-amber-900 w-24 bg-gray-700 text-white disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleAddItem}
            disabled={!isAddButtonEnabled}
            className="inline-flex items-center justify-center cursor-pointer rounded-full bg-green-600 p-3 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            title="Add item to order"
          >
            <FaPlus />
          </button>
        </div>
      </form>

      {currentPersonItems.length > 0 && (
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            {personName ? `${personName}'s Order` : "Current Order"}
          </h3>

          <div className="space-y-3 mb-4">
            {currentPersonItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400 text-sm">{item.restaurantName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white">x{item.quantity}</span>
                  <span className="text-amber-500 font-semibold min-w-20 text-right">
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.menuItemId)}
                    className="text-red-400 hover:text-red-300 p-2 cursor-pointer rounded hover:bg-gray-600 transition-colors"
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-600 pt-4 flex justify-between items-center text-xl font-semibold">
            <span className="text-white">Subtotal:</span>
            <span className="text-amber-500">{currentSubtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleSubmitPersonOrder}
            disabled={!personName || currentPersonItems.length === 0}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg text-lg"
          >
            Add {personName ? `${personName}'s` : "This"} Order to Main Cart
          </button>
        </div>
      )}

      {isRestaurantModalOpen && (
        <AddRestaurantModal
          open={isRestaurantModalOpen}
          setOpen={setIsRestaurantModalOpen}
        />
      )}

      {isMenuItemModalOpen && (
        <AddMenuItemModal
          open={isMenuItemModalOpen}
          setOpen={setIsMenuItemModalOpen}
          restaurantId={selectedRestaurantId}
        />
      )}
    </div>
  );
};

export default OrderForm;

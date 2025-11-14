import { createContext, useEffect, useState } from "react";
import { dataService } from "../services";

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("currentCart");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });
  useEffect(() => {
    dataService
      .getRestaurants()
      .then((data) => setRestaurants(data))
      .catch((err) => console.error(err));
    dataService
      .getMenuItems()
      .then((data) => setMenuItems(data))
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("currentCart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart]);
  const addRestaurant = async (name) => {
    try {
      const newRestaurant = await dataService.addRestaurant(name);
      setRestaurants((prev) => [...prev, newRestaurant]);
      return newRestaurant;
    } catch (error) {
      console.error("failed to add restaurant", error);
      throw error;
    }
  };
  const getRestaurants = async () => {
    try {
      return restaurants;
    } catch (error) {
      console.error("Failed to get restaurants", error);
      throw error;
    }
  };
  const addMenuItem = async (restaurantId, name, price) => {
    try {
      const newMenuItem = await dataService.addMenuItem(
        restaurantId,
        name,
        price
      );
      setMenuItems((prev) => [...prev, newMenuItem]);
      return newMenuItem;
    } catch (error) {
      console.error("failed to add item", error);
      throw error;
    }
  };
  const addPersonOrder = (personName, items) => {
    const newOrder = {
      id: Date.now(),
      personName,
      items,
      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };
    setCart((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const removePersonOrder = (orderId) => {
    setCart((prev) => prev.filter((order) => order.id !== orderId));
  };

  const clearCart = async () => {
    try {
      await dataService.clearCurrentCart();
      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart", error);
      throw error;
    }
  };

  const getOrdersByPerson = () => {
    return cart;
  };

  const getOrdersByItem = () => {
    const itemsMap = {};

    cart.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.menuItemId;
        if (!itemsMap[key]) {
          itemsMap[key] = {
            name: item.name,
            restaurantName: item.restaurantName,
            totalQuantity: 0,
            totalPrice: 0,
            orders: [],
          };
        }
        itemsMap[key].totalQuantity += item.quantity;
        itemsMap[key].totalPrice += item.price * item.quantity;
        itemsMap[key].orders.push({
          personName: order.personName,
          quantity: item.quantity,
        });
      });
    });

    return Object.values(itemsMap);
  };
  return (
    <AppDataContext.Provider
      value={{
        cart,
        restaurants,
        menuItems,
        addRestaurant,
        getRestaurants,
        addMenuItem,
        addPersonOrder,
        removePersonOrder,
        clearCart,
        getOrdersByPerson,
        getOrdersByItem,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export default AppDataContext;

import DataService from "./dataService";

class LocalStorageService extends DataService {
  async getRestaurants() {
    const data = localStorage.getItem("restaurants");
    return data ? JSON.parse(data) : [];
  }
  async addRestaurant(name) {
    const restaurants = await this.getRestaurants();
    const newRestaurant = {
      id: Date.now(),
      name: name,
    };
    restaurants.push(newRestaurant);
    localStorage.setItem("restaurants", JSON.stringify(restaurants));
    return newRestaurant;
  }
  async deleteRestaurant(id) {
    const restaurants = await this.getRestaurants();
    const newRestaurants = restaurants.filter(
      (restaurant) => restaurant.id !== id
    );
    localStorage.setItem("restaurants", JSON.stringify(newRestaurants));
  }
  async updateRestaurant(id, name) {
    const restaurants = await this.getRestaurants();
    const newRestaurants = restaurants.map((restaurant) =>
      restaurant.id === id ? { ...restaurant, name } : restaurant
    );
    localStorage.setItem("restaurants", JSON.stringify(newRestaurants));
  }
  async getMenuItems(restaurantId) {
    const allItems = JSON.parse(localStorage.getItem("menuItems") || "[]");
    return restaurantId
      ? allItems.filter((item) => item.restaurantId === restaurantId)
      : allItems;
  }
  async addMenuItem(restaurantId, name, price) {
    const allItems = JSON.parse(localStorage.getItem("menuItems") || "[]");
    const newItem = {
      id: Date.now(),
      name: name,
      price: price,
      restaurantId: restaurantId,
    };
    allItems.push(newItem);
    localStorage.setItem("menuItems", JSON.stringify(allItems));
    return newItem;
  }
  async deleteMenuItem(id) {
    const allItems = JSON.parse(localStorage.getItem("menuItems") || "[]");
    const newItems = allItems.filter((item) => item.id !== id);
    localStorage.setItem("menuItems", JSON.stringify(newItems));
  }

  async updateMenuItem(id, name, price) {
    const allItems = JSON.parse(localStorage.getItem("menuItems") || "[]");
    const newItems = allItems.map((item) =>
      item.id === id ? { ...item, name, price: parseFloat(price) } : item
    );
    localStorage.setItem("menuItems", JSON.stringify(newItems));
  }

  async getCurrentCart() {
    const data = localStorage.getItem("currentCart");
    return data ? JSON.parse(data) : [];
  }

  async saveCurrentCart(cart) {
    localStorage.setItem("currentCart", JSON.stringify(cart));
    return cart;
  }

  async clearCurrentCart() {
    localStorage.removeItem("currentCart");
    return [];
  }
}

export default new LocalStorageService();

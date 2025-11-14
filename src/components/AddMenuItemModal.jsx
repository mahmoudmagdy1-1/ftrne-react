import { useContext, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import AppDataContext from "../context/AppDataContext";

function AddMenuItemModal({ open, setOpen, restaurantId }) {
  const { addMenuItem } = useContext(AppDataContext);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError("Item name is required");
      return;
    }
    if (!itemPrice || parseFloat(itemPrice) <= 0) {
      setError("Valid price is required");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      await addMenuItem(restaurantId, itemName.trim(), itemPrice);

      setItemName("");
      setItemPrice("");
      setOpen(false);
    } catch (err) {
      setError("Failed to add menu item.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-600/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <form onSubmit={handleSubmit}>
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-white mb-8"
                    >
                      Add Menu Item
                    </DialogTitle>

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="itemName" className="text-white">
                          Item Name:
                        </label>
                        <input
                          type="text"
                          id="itemName"
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          placeholder="e.g., Btats"
                          disabled={isSubmitting}
                          className="border border-white rounded-lg outline-none w-full px-2 py-2 focus:border-amber-900 bg-gray-700 text-white"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="itemPrice" className="text-white">
                          Price:
                        </label>
                        <input
                          type="number"
                          id="itemPrice"
                          value={itemPrice}
                          onChange={(e) => setItemPrice(e.target.value)}
                          placeholder="10"
                          step="0.01"
                          min="0"
                          disabled={isSubmitting}
                          className="border border-white rounded-lg outline-none w-full px-2 py-2 focus:border-amber-900 bg-gray-700 text-white"
                        />
                      </div>

                      {error && <p className="text-red-400 text-sm">{error}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-md cursor-pointer bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-900 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Item"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default AddMenuItemModal;

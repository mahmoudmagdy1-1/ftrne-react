import { useContext, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import AppDataContext from "../context/AppDataContext";

function AddRestaurantModal({ open, setOpen }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantName.trim()) {
      setError("Restaurant name is required");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await addRestaurant(restaurantName.trim());
      setRestaurantName("");
      setOpen(false);
    } catch (err) {
      setError("Failed to add restaurant.");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const { addRestaurant } = useContext(AppDataContext);
  const [restaurantName, setRestaurantName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-600/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-white mb-8"
                    >
                      Add Restaurant
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                      <div className="flex gap-4 items-center">
                        <label htmlFor="restaurantName" className="">
                          Restaurant Name:
                        </label>
                        <input
                          type="text"
                          id="restaurantName"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          placeholder="Enter restaurant name eg. 7rb"
                          disabled={isSubmitting}
                          required
                          className="border border-white rounded-lg outline-none w-full px-2 sm:pr-8 py-2 focus:border-amber-900 "
                        />
                        {error && <p>{error}</p>}
                      </div>
                      <div className="px-8 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full justify-center rounded-md cursor-pointer bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-900 sm:ml-3 sm:w-auto"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          data-autofocus
                          className="mt-3 inline-flex w-full justify-center cursor-pointer rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
export default AddRestaurantModal;

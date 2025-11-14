import { FaPlus } from "react-icons/fa";
import { Link } from "react-router";

const HomePage = () => {
  return (
    <div className="flex gap-8">
      <Link className="flex-1" to="/orders/new">
        <div className="p-12 flex flex-col gap-1 items-center justify-center rounded-2xl shadow-sm shadow-amber-500 hover:border-2 hover:border-amber-500 hover:text-amber-500 tran50">
          <FaPlus className="text-center" size={25} />
          <h3 className="font-bold">Create New Order</h3>
          <h4>Start group breakfast</h4>
        </div>
      </Link>
    </div>
  );
};

export default HomePage;

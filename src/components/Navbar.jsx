import { CiForkAndKnife } from "react-icons/ci";
import { Link } from "react-router";

export const Navbar = () => {
  return (
    <div>
      <nav className="h-20 flex justify-between items-center container px-4 mx-auto">
        <Link
          className="w-16 h-16 bg-amber-900 flex items-center justify-center rounded-2xl"
          to={"/"}
        >
          <CiForkAndKnife size={32} />
        </Link>
        <div className="flex gap-4">
          <Link to={"/orders/new"}>Create Order</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

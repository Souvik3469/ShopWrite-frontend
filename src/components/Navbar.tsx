import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useRouter } from "next/router";
import Loading from "./Loading";

export default function Navbar() {
  const { cartItems } = useCart();
  const { user, userLoading, userError, refetchUser } = useUser();
  const Router = useRouter();
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    refetchUser();
    Router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="text-2xl font-bold flex items-center cursor-pointer space-x-1">
            <span className="text-yellow-400">Shop</span>
            <span className="text-white">Write</span>
          </div>
        </Link>

        <div className="flex flex-grow mx-4">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full p-2 rounded-l-md text-gray-600 border-none focus:outline-none"
          />
          <button className="bg-yellow-500 p-2 rounded-r-md text-white hover:bg-yellow-600">
            <FaSearch />
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <div className="flex items-center space-x-6">
              <Link href="/orders">
                <div className="hover:text-yellow-400">
                  <div className="text-xs xl:text-sm cursor-pointer">
                    Returns
                  </div>
                  <div className="text-sm xl:text-base font-bold cursor-pointer">
                    & Orders
                  </div>
                </div>
              </Link>
              <Link href="/profile">
                <div className="hover:text-yellow-400 font-bold cursor-pointer">
                  Hello {user.name}!
                </div>
              </Link>
              <Link href="/cart">
                <div className="flex items-center space-x-1 hover:text-yellow-400">
                  <div className="relative">
                    <FaShoppingCart className="text-xl" />
                    <span className=" absolute  -top-5 right-1 text-sm font-bold text-orange-400">
                      {cartCount}
                    </span>
                  </div>
                  <div className="text-sm xl:text-base font-bold">Cart</div>
                </div>
              </Link>
              <button onClick={handleLogout} className="hover:text-yellow-400">
                <BiLogOut className="text-3xl" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <div className="hover:text-yellow-400 font-bold cursor-pointer">
                Log In
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

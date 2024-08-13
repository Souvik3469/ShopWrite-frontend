import React from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  fixedDiscount: number;
  variableDiscount: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, cartItems } = useCart();
  const { user } = useUser();

  const showToast = (message: string, type: "success" | "error" = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const cartItem = cartItems.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!user) {
      showToast("Please login to add items", "error");
      return;
    }
    addToCart(product);
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity <= 0) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, quantity);
    }
  };

  return (
    <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
          src={product.image}
          alt={product.name}
        />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
          {product.variableDiscount}% OFF
        </span>
      </div>

      <div className="mt-4 px-5 pb-5 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:translate-x-3 hover:scale-110">
        <Link href={`/product/${product.id}`}>
          <h5 className="text-xl tracking-tight text-slate-900">
            {product.name}
          </h5>
        </Link>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">
              ${product.price}
            </span>
            <span className="text-sm ml-2 text-slate-700 line-through">
              $1599
            </span>
          </p>
        </div>
        {currentQuantity > 0 ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(currentQuantity - 1)}
              disabled={currentQuantity <= 0}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
            >
              -
            </button>
            <span className="text-gray-700">{currentQuantity}</span>
            <button
              onClick={() => handleQuantityChange(currentQuantity + 1)}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 hover:cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <FaShoppingCart className="text-xl mx-2" />
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

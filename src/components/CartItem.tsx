import React from "react";
import { FaPlus, FaMinus, FaTrashCan } from "react-icons/fa6";

interface CartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  fixedDiscount: number;
  variableDiscount: number;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

export default function CartItem({
  id,
  name,
  image,
  price,
  quantity,
  fixedDiscount,
  variableDiscount,
  updateQuantity,
  removeFromCart,
}: CartItemProps) {
  const total = price * quantity;
  const FixedDiscount = fixedDiscount * quantity;
  const VariableDiscount = variableDiscount * 0.01 * total;

  return (
    <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6 border-b border-gray-200 group">
      <div className="w-full md:max-w-[126px]">
        <img
          src={image}
          alt={name}
          className="mx-auto rounded-xl transition-transform duration-300 ease-in-out transform hover:scale-110"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 w-full">
        <div className="md:col-span-2">
          <div className="flex flex-col max-[500px]:items-center gap-3">
            <h6 className="font-semibold text-base leading-7 text-black">
              {name}
            </h6>
            {/* <h6 className="font-normal text-base leading-7 text-gray-500">
          {description}
        </h6> */}
            <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-indigo-600">
              ${price.toFixed(2)}
              {variableDiscount && (
                <span className="text-red-500"> (-{variableDiscount}%)</span>
              )}
            </h6>
          </div>
        </div>
        <div className="flex items-center max-[500px]:justify-center h-full max-md:mt-3">
          <div className="flex items-center h-full relative">
            <button
              onClick={() => updateQuantity(id, quantity - 1)}
              disabled={quantity <= 1}
              className="group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
            >
              <FaMinus className="text-xl" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
              className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[14px] text-center bg-transparent"
              min="1"
            />
            <button
              onClick={() => updateQuantity(id, quantity + 1)}
              className="group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
            >
              <FaPlus className="text-xl" />
            </button>
            <button
              onClick={() => removeFromCart(id)}
              className=" ml-4 z-10 relative"
            >
              <FaTrashCan className="text-lg text-red-600 hover:text-red-800" />
            </button>
          </div>
        </div>
        <div className="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
          <p className="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-indigo-600 z-0">
            ${(total - FixedDiscount - VariableDiscount).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

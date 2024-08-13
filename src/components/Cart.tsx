import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import { useMemo } from "react";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalFixedDiscount = cartItems.reduce(
    (acc, item) => acc + item.fixedDiscount * item.quantity,
    0
  );

  const totalVariableDiscount = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.variableDiscount * 0.01 * item.quantity,
    0
  );

  const total = subtotal - totalFixedDiscount - totalVariableDiscount;

  return (
    <section className=" relative z-10 after:contents-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto relative z-10">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-12">
            <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-14 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
              <div className="flex items-center justify-between pb-8 border-b border-gray-300">
                <h2 className="font-manrope font-bold text-3xl leading-10 text-black">
                  Shopping Cart
                </h2>

                <h2 className="font-manrope font-bold text-xl leading-8 text-gray-600">
                  {cartCount} items
                </h2>
              </div>
              <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
                <div className="col-span-12 md:col-span-7">
                  <p className="font-normal text-lg leading-8 text-gray-400">
                    Product Details
                  </p>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div className="grid grid-cols-5">
                    <div className="col-span-3">
                      <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                        Quantity
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                        Total
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  quantity={item.quantity}
                  fixedDiscount={item.fixedDiscount}
                  variableDiscount={item.variableDiscount}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
            <div className=" col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8 py-24">
              <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
                Order Summary
              </h2>
              <div className="mt-8">
                <div className="flex items-center justify-between pb-2">
                  <p className="font-normal text-lg leading-8 text-black">
                    {cartCount} items
                  </p>
                  <p className="font-medium text-lg leading-8 text-black">
                    <span className="text-md text-gray-400 font-md mx-2">
                      Subtotal:
                    </span>
                    ${subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-end pb-2">
                  <p className="font-medium text-lg leading-8 text-black">
                    <span className="text-md text-gray-400 font-md mx-2">
                      Fixed Discount:
                    </span>
                    -${totalFixedDiscount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-end pb-6">
                  <p className="font-medium text-lg leading-8 text-black">
                    <span className="text-md text-gray-400 font-md mx-2">
                      Variable Discount:
                    </span>
                    -${totalVariableDiscount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-end pb-6">
                  <p className="font-medium text-lg leading-8 text-black">
                    <span className="text-lg text-gray-400 font-md mx-2">
                      Total:
                    </span>
                    ${total.toFixed(2)}
                  </p>
                </div>
                <Link href="/checkout">
                  <div className="flex items-center border-b border-gray-200">
                    <button className="rounded-lg w-full bg-black py-2.5 px-4 text-white text-md font-semibold text-center mb-8 transition-all duration-500 hover:bg-black/80">
                      Checkout
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </section>
  );
}

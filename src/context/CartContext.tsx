import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useUser } from "./UserContext";

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

interface CartItem extends Product {
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (user?.id) {
      const storedCartItems = localStorage.getItem(`${user.id}-cart`);
      setCartItems(storedCartItems ? JSON.parse(storedCartItems) : []);
    } else {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`${user.id}-cart`, JSON.stringify(cartItems));
    }
  }, [cartItems, user?.id]);

  const addToCart = (product: Product) => {
    if (user?.id) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    }
  };

  const removeFromCart = (productId: string) => {
    if (user?.id) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (user?.id) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

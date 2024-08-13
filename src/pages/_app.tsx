import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3000,
      },
    },
  });

  const router = useRouter();
  const noNavbarRoutes = ["/login", "/register"];

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {!noNavbarRoutes.includes(router.pathname) && <Navbar />}

          <Component {...pageProps} />
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

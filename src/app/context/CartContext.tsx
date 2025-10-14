// app/context/CartContext.tsx

"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
  slug: string;
  stock: number;
  maxQuantity: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  slug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isInStock: boolean;
  addedAt: string;
}

interface AppState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  isLoading: boolean;
  isSyncing: boolean;
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SYNCING"; payload: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "LOAD_WISHLIST"; payload: WishlistItem[] }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_TO_WISHLIST"; payload: WishlistItem }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "SYNC_CART_SUCCESS"; payload: CartItem[] }
  | { type: "SYNC_WISHLIST_SUCCESS"; payload: WishlistItem[] };

const initialState: AppState = {
  cart: [],
  wishlist: [],
  cartCount: 0,
  wishlistCount: 0,
  isLoading: true,
  isSyncing: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_SYNCING":
      return { ...state, isSyncing: action.payload };

    case "LOAD_CART":
      return {
        ...state,
        cart: action.payload,
        cartCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        isLoading: false,
      };

    case "LOAD_WISHLIST":
      return {
        ...state,
        wishlist: action.payload,
        wishlistCount: action.payload.length,
        isLoading: false,
      };

    case "ADD_TO_CART":
      const existingCartItem = state.cart.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      let newCart;
      if (existingCartItem) {
        newCart = state.cart.map((item) =>
          item.productId === action.payload.productId &&
          item.color === action.payload.color &&
          item.size === action.payload.size
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + action.payload.quantity,
                  item.maxQuantity
                ),
              }
            : item
        );
      } else {
        newCart = [...state.cart, action.payload];
      }
      return {
        ...state,
        cart: newCart,
        cartCount: newCart.reduce((sum, item) => sum + item.quantity, 0),
      };

    case "REMOVE_FROM_CART":
      const filteredCart = state.cart.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        cart: filteredCart,
        cartCount: filteredCart.reduce((sum, item) => sum + item.quantity, 0),
      };

    case "UPDATE_CART_QUANTITY":
      const updatedCart = state.cart
        .map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.min(action.payload.quantity, item.maxQuantity),
              }
            : item
        )
        .filter((item) => item.quantity > 0);
      return {
        ...state,
        cart: updatedCart,
        cartCount: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
        cartCount: 0,
      };

    case "ADD_TO_WISHLIST":
      const existingWishlistItem = state.wishlist.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingWishlistItem) {
        return state;
      }
      const newWishlist = [...state.wishlist, action.payload];
      return {
        ...state,
        wishlist: newWishlist,
        wishlistCount: newWishlist.length,
      };

    case "REMOVE_FROM_WISHLIST":
      const filteredWishlist = state.wishlist.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        wishlist: filteredWishlist,
        wishlistCount: filteredWishlist.length,
      };

    case "SYNC_CART_SUCCESS":
      return {
        ...state,
        cart: action.payload,
        cartCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        isSyncing: false,
      };

    case "SYNC_WISHLIST_SUCCESS":
      return {
        ...state,
        wishlist: action.payload,
        wishlistCount: action.payload.length,
        isSyncing: false,
      };

    default:
      return state;
  }
}

interface CartContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToCart: (product: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateCartQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  addToWishlist: (
    product: Omit<WishlistItem, "id" | "addedAt">
  ) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  syncWithDatabase: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { data: session, status } = useSession();

  // API calls with proper error handling
  const fetchCart = async (): Promise<CartItem[]> => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      return data.cart || [];
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  };

  const fetchWishlist = async (): Promise<WishlistItem[]> => {
    try {
      const response = await fetch("/api/wishlist");
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data = await response.json();
      return data.wishlist || [];
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  };

  const addToCartAPI = async (
    product: Omit<CartItem, "id">
  ): Promise<CartItem> => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.productId,
          quantity: product.quantity,
          color: product.color || "",
          size: product.size || "",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add to cart");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding to cart API:", error);
      throw error;
    }
  };

  const removeFromCartAPI = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove from cart");
      }
    } catch (error) {
      console.error("Error removing from cart API:", error);
      throw error;
    }
  };

  const updateCartQuantityAPI = async (
    id: string,
    quantity: number
  ): Promise<CartItem> => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart quantity");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating cart quantity API:", error);
      throw error;
    }
  };

  const clearCartAPI = async (): Promise<void> => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart API:", error);
      throw error;
    }
  };

  const addToWishlistAPI = async (
    product: Omit<WishlistItem, "id" | "addedAt">
  ): Promise<WishlistItem> => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.productId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add to wishlist");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding to wishlist API:", error);
      throw error;
    }
  };

  const removeFromWishlistAPI = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist API:", error);
      throw error;
    }
  };

  // Public methods with proper database synchronization
  const addToCart = async (product: Omit<CartItem, "id">): Promise<void> => {
    if (status === "authenticated") {
      try {
        dispatch({ type: "SET_SYNCING", payload: true });
        const cartItem = await addToCartAPI(product);
        dispatch({ type: "ADD_TO_CART", payload: cartItem });
      } catch (error) {
        console.error("Error adding to cart:", error);
        // Don't fallback to local state for authenticated users - show error instead
        throw error;
      } finally {
        dispatch({ type: "SET_SYNCING", payload: false });
      }
    } else {
      // Guest user - use local storage with temporary ID
      const localItem: CartItem = {
        ...product,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      dispatch({ type: "ADD_TO_CART", payload: localItem });
    }
  };

  const removeFromCart = async (id: string): Promise<void> => {
    if (status === "authenticated" && !id.startsWith("local-")) {
      try {
        dispatch({ type: "SET_SYNCING", payload: true });
        await removeFromCartAPI(id);
        dispatch({ type: "REMOVE_FROM_CART", payload: id });
      } catch (error) {
        console.error("Error removing from cart:", error);
        // Don't fallback - show error instead
        throw error;
      } finally {
        dispatch({ type: "SET_SYNCING", payload: false });
      }
    } else {
      // Guest user or local item
      dispatch({ type: "REMOVE_FROM_CART", payload: id });
    }
  };

  const updateCartQuantity = async (
    id: string,
    quantity: number
  ): Promise<void> => {
    if (status === "authenticated" && !id.startsWith("local-")) {
      try {
        dispatch({ type: "SET_SYNCING", payload: true });
        const updatedItem = await updateCartQuantityAPI(id, quantity);
        dispatch({
          type: "UPDATE_CART_QUANTITY",
          payload: { id, quantity: updatedItem.quantity },
        });
      } catch (error) {
        console.error("Error updating cart quantity:", error);
        throw error;
      } finally {
        dispatch({ type: "SET_SYNCING", payload: false });
      }
    } else {
      // Guest user or local item
      dispatch({ type: "UPDATE_CART_QUANTITY", payload: { id, quantity } });
    }
  };

  const clearCart = async (): Promise<void> => {
    if (status === "authenticated") {
      try {
        dispatch({ type: "SET_SYNCING", payload: true });
        await clearCartAPI();
        dispatch({ type: "CLEAR_CART" });
      } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
      } finally {
        dispatch({ type: "SET_SYNCING", payload: false });
      }
    } else {
      // Guest user
      dispatch({ type: "CLEAR_CART" });
    }
  };

  const addToWishlist = async (
    product: Omit<WishlistItem, "id" | "addedAt">
  ): Promise<void> => {
    if (status === "authenticated") {
      try {
        dispatch({ type: "SET_SYNCING", payload: true });
        const wishlistItem = await addToWishlistAPI(product);
        dispatch({ type: "ADD_TO_WISHLIST", payload: wishlistItem });
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
      } finally {
        dispatch({ type: "SET_SYNCING", payload: false });
      }
    } else {
      // Guest user - use local storage with temporary ID
      const localItem: WishlistItem = {
        ...product,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_TO_WISHLIST", payload: localItem });
    }
  };

  const removeFromWishlist = async (id: string): Promise<void> => {
    if (status === "authenticated" && !id.startsWith("local-")) {
      try {
        dispatch({ type: "SET_SYNCING", payload: true });
        await removeFromWishlistAPI(id);
        dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error;
      } finally {
        dispatch({ type: "SET_SYNCING", payload: false });
      }
    } else {
      // Guest user or local item
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id });
    }
  };

  const syncWithDatabase = async (): Promise<void> => {
    if (status === "authenticated") {
      try {
        dispatch({ type: "SET_SYNCING", payload: true });
        const [cartData, wishlistData] = await Promise.all([
          fetchCart(),
          fetchWishlist(),
        ]);

        dispatch({ type: "SYNC_CART_SUCCESS", payload: cartData });
        dispatch({ type: "SYNC_WISHLIST_SUCCESS", payload: wishlistData });
      } catch (error) {
        console.error("Error syncing with database:", error);
        // Don't update state if sync fails
      } finally {
        dispatch({ type: "SET_SYNCING", payload: false });
      }
    }
  };

  // Load data on mount and when session changes
  useEffect(() => {
    const loadData = async () => {
      if (status === "loading") {
        dispatch({ type: "SET_LOADING", payload: true });
        return;
      }

      if (status === "authenticated") {
        // Load from database for authenticated users
        try {
          await syncWithDatabase();
        } catch (error) {
          console.error("Error loading data:", error);
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } else {
        // Load from localStorage for guest users
        try {
          const savedCart = localStorage.getItem("britcart-cart");
          const savedWishlist = localStorage.getItem("britcart-wishlist");

          if (savedCart) {
            const cartData: CartItem[] = JSON.parse(savedCart);
            dispatch({ type: "LOAD_CART", payload: cartData });
          }

          if (savedWishlist) {
            const wishlistData: WishlistItem[] = JSON.parse(savedWishlist);
            dispatch({ type: "LOAD_WISHLIST", payload: wishlistData });
          }

          dispatch({ type: "SET_LOADING", payload: false });
        } catch (error) {
          console.error("Error loading from localStorage:", error);
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadData();
  }, [status]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (status !== "authenticated" && !state.isLoading) {
      localStorage.setItem("britcart-cart", JSON.stringify(state.cart));
      localStorage.setItem("britcart-wishlist", JSON.stringify(state.wishlist));
    }
  }, [state.cart, state.wishlist, status, state.isLoading]);

  // Sync when user logs in (merge guest cart with user cart)
  useEffect(() => {
    if (status === "authenticated" && !state.isLoading) {
      const guestCart = JSON.parse(
        localStorage.getItem("britcart-cart") || "[]"
      );
      if (guestCart.length > 0) {
        // Merge guest cart with user cart
        guestCart.forEach(async (item: CartItem) => {
          if (item.id.startsWith("local-")) {
            try {
              await addToCart(item);
            } catch (error) {
              console.error("Error merging cart item:", error);
            }
          }
        });
        // Clear guest cart from localStorage
        localStorage.removeItem("britcart-cart");
        localStorage.removeItem("britcart-wishlist");
      }
    }
  }, [status, state.isLoading]);

  const value: CartContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    syncWithDatabase,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

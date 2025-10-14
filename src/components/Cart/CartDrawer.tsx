// components/Cart/CartDrawer.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useCart } from "../../app/context/CartContext";
import { CartItem } from "../../app/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { state, removeFromCart, updateCartQuantity } = useCart();
  const { cart, cartCount } = state;
  const cartRef = React.useRef<HTMLDivElement>(null);
  const [isUpdatingCart, setIsUpdatingCart] = React.useState<string | null>(
    null
  );

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(id);
      return;
    }

    setIsUpdatingCart(id);
    try {
      await updateCartQuantity(id, newQuantity);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setIsUpdatingCart(null);
    }
  };

  const ActionButton = ({
    icon: Icon,
    onClick,
    label,
    className = "",
    loading = false,
  }: {
    icon: React.ElementType;
    onClick: () => void;
    label: string;
    className?: string;
    loading?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative p-2 rounded-lg text-brand-neutral-700 hover:text-brand-primary-600 hover:bg-brand-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={label}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          <motion.div
            ref={cartRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-96 max-w-full bg-white z-50 flex flex-col shadow-xl"
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-neutral-200">
              <h2 className="text-lg font-semibold text-brand-neutral-900">
                Shopping Cart ({cartCount})
              </h2>
              <ActionButton icon={X} onClick={onClose} label="Close cart" />
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <ShoppingCart className="h-16 w-16 text-brand-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-brand-neutral-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-brand-neutral-500 mb-6">
                    Add some items to get started
                  </p>
                  <Link
                    href="/shop"
                    className="px-6 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors duration-200 font-medium"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-brand-neutral-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-brand-neutral-900 truncate mb-1">
                          {item.name}
                        </h3>

                        {(item.color || item.size) && (
                          <p className="text-xs text-brand-neutral-500 mb-2">
                            {[item.color, item.size]
                              .filter(Boolean)
                              .join(" • ")}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-brand-neutral-200 rounded-lg">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={isUpdatingCart === item.id}
                              className="px-2 py-1 text-brand-neutral-600 hover:bg-brand-neutral-50 transition-colors disabled:opacity-50"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-sm font-medium min-w-8 text-center">
                              {isUpdatingCart === item.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                isUpdatingCart === item.id ||
                                item.quantity >= item.maxQuantity
                              }
                              className="px-2 py-1 text-brand-neutral-600 hover:bg-brand-neutral-50 transition-colors disabled:opacity-50"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-brand-primary-600">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isUpdatingCart === item.id}
                              className="p-1 text-brand-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-brand-neutral-200 p-6 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <p className="text-xs text-brand-neutral-500 text-center">
                  Shipping & taxes calculated at checkout
                </p>

                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="block w-full bg-brand-primary-600 text-white text-center py-3 rounded-lg hover:bg-brand-primary-700 transition-colors duration-200 font-medium"
                    onClick={onClose}
                  >
                    Proceed to Checkout
                  </Link>

                  <button
                    onClick={onClose}
                    className="block w-full text-brand-primary-600 text-center py-2 hover:text-brand-primary-700 transition-colors duration-200 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

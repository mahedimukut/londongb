"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  stats?: {
    totalOrders: number;
    wishlistCount: number;
    cartCount: number;
    reviewsCount: number;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
    phone: "",
    isDefault: false,
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setAddresses(data.user.addresses || []);

        // Set profile form with user data
        setProfileForm({
          name: data.user.name || "",
          email: data.user.email || "",
          phone:
            data.user.addresses?.find((addr: Address) => addr.isDefault)
              ?.phone || "",
        });

        toast.success("Profile loaded successfully", {
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        console.error("Failed to fetch user data");
        toast.error("Failed to load profile data", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userData) return;

    const toastId = toast.loading("Updating profile...", {
      position: "bottom-right",
    });

    setIsSaving(true);
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);

        toast.update(toastId, {
          render: "Profile updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
        });

        // Refresh addresses to get updated phone if needed
        await fetchUserData();
      } else {
        const error = await response.json();
        toast.update(toastId, {
          render: error.error || "Failed to update profile",
          type: "error",
          isLoading: false,
          autoClose: 4000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.update(toastId, {
        render: "Failed to update profile",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        hideProgressBar: false,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "street",
      "city",
      "state",
      "postalCode",
      "phone",
    ];
    const missingFields = requiredFields.filter(
      (field) => !addressForm[field as keyof typeof addressForm]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
        {
          position: "bottom-right",
        }
      );
      return;
    }

    const toastId = toast.loading(
      editingAddress ? "Updating address..." : "Adding address...",
      {
        position: "bottom-right",
      }
    );

    setIsProcessing(true);
    try {
      console.log("Saving address:", { editingAddress, addressForm });

      let response;

      if (editingAddress) {
        // Update existing address
        console.log("Updating address with ID:", editingAddress.id);
        response = await fetch(`/api/addresses/${editingAddress.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressForm),
        });
      } else {
        // Create new address
        console.log("Creating new address");
        response = await fetch("/api/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressForm),
        });
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        await fetchUserData();
        resetAddressForm();

        toast.update(toastId, {
          render: editingAddress
            ? "Address updated successfully!"
            : "Address added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
        });
      } else {
        console.error("API Error:", result);
        toast.update(toastId, {
          render:
            result.error ||
            `Failed to ${editingAddress ? "update" : "add"} address`,
          type: "error",
          isLoading: false,
          autoClose: 4000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.update(toastId, {
        render:
          "Failed to save address. Please check your connection and try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        hideProgressBar: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    // Custom toast confirmation
    toast.info(
      <div className="p-2">
        <p className="font-semibold mb-2">Delete Address?</p>
        <p className="text-sm mb-4">This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss();

              const toastId = toast.loading("Deleting address...", {
                position: "bottom-right",
              });

              setIsProcessing(true);
              try {
                console.log("Deleting address with ID:", addressId);

                const response = await fetch(`/api/addresses/${addressId}`, {
                  method: "DELETE",
                });

                const result = await response.json();
                console.log("Delete Response:", result);

                if (response.ok) {
                  await fetchUserData();
                  toast.update(toastId, {
                    render: "Address deleted successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    hideProgressBar: false,
                  });
                } else {
                  console.error("Delete Error:", result);
                  toast.update(toastId, {
                    render: result.error || "Failed to delete address",
                    type: "error",
                    isLoading: false,
                    autoClose: 4000,
                    hideProgressBar: false,
                  });
                }
              } catch (error) {
                console.error("Error deleting address:", error);
                toast.update(toastId, {
                  render:
                    "Failed to delete address. Please check your connection and try again.",
                  type: "error",
                  isLoading: false,
                  autoClose: 4000,
                  hideProgressBar: false,
                });
              } finally {
                setIsProcessing(false);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
          >
            Keep Address
          </button>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true,
      }
    );
  };

  const resetAddressForm = () => {
    setAddressForm({
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Bangladesh",
      phone: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowAddressForm(false);

    toast.info("Address form cleared", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const editAddress = (address: Address) => {
    console.log("Editing address:", address);
    setAddressForm({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setShowAddressForm(true);

    toast.info("Editing address...", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const setDefaultAddress = async (addressId: string) => {
    const toastId = toast.loading("Setting default address...", {
      position: "bottom-right",
    });

    setIsProcessing(true);
    try {
      const address = addresses.find((addr) => addr.id === addressId);
      if (!address) return;

      console.log("Setting default address:", addressId);

      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...address,
          isDefault: true,
        }),
      });

      const result = await response.json();
      console.log("Set Default Response:", result);

      if (response.ok) {
        await fetchUserData();
        toast.update(toastId, {
          render: "Default address updated!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
        });
      } else {
        console.error("Set Default Error:", result);
        toast.update(toastId, {
          render: result.error || "Failed to set default address",
          type: "error",
          isLoading: false,
          autoClose: 4000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.update(toastId, {
        render:
          "Failed to set default address. Please check your connection and try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        hideProgressBar: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
          Account Settings
        </h2>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary-600" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
          Account Settings
        </h2>
        <div className="text-center py-12">
          <p className="text-brand-neutral-500">Failed to load user data</p>
          <button
            onClick={fetchUserData}
            className="mt-4 px-6 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
        Account Settings
      </h2>

      {/* Tab Navigation */}
      <div className="border-b border-brand-neutral-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-brand-primary-500 text-brand-primary-600"
                    : "border-transparent text-brand-neutral-500 hover:text-brand-neutral-700 hover:border-brand-neutral-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="border border-brand-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary-600" />
              Personal Information
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-neutral-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-neutral-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-brand-neutral-50 rounded-lg">
              <h4 className="font-medium text-brand-neutral-900 mb-2">
                Account Information
              </h4>
              <div className="text-sm text-brand-neutral-600 space-y-1">
                <p>
                  Member since:{" "}
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Email {userData.emailVerified ? "verified" : "not verified"}
                </p>
                {userData.stats && (
                  <p>
                    {userData.stats.totalOrders} orders •{" "}
                    {userData.stats.wishlistCount} wishlist items •{" "}
                    {userData.stats.reviewsCount} reviews
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="mt-4 px-6 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && (
        <div className="space-y-6">
          {/* Add/Edit Address Form */}
          {showAddressForm && (
            <div className="border border-brand-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={addressForm.firstName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={addressForm.lastName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                  className="rounded border-brand-neutral-300 text-brand-primary-600 focus:ring-brand-primary-500"
                />
                <span className="text-brand-neutral-700">
                  Set as default address
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveAddress}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingAddress ? "Update Address" : "Add Address"}
                </button>
                <button
                  onClick={resetAddressForm}
                  disabled={isProcessing}
                  className="px-6 py-2 border border-brand-neutral-300 text-brand-neutral-700 rounded-lg hover:bg-brand-neutral-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Addresses List */}
          <div className="border border-brand-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brand-neutral-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-primary-600" />
                Saved Addresses
              </h3>
              {!showAddressForm && (
                <button
                  onClick={() => {
                    setShowAddressForm(true);
                    toast.info("Add new address form opened", {
                      position: "bottom-right",
                      autoClose: 2000,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Address
                </button>
              )}
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-brand-neutral-300 mx-auto mb-3" />
                <p className="text-brand-neutral-500">No addresses saved yet</p>
                <p className="text-brand-neutral-400 text-sm mt-1">
                  Add your first address to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 ${
                      address.isDefault
                        ? "border-brand-primary-300 bg-brand-primary-50"
                        : "border-brand-neutral-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-brand-neutral-900">
                          {address.firstName} {address.lastName}
                          {address.isDefault && (
                            <span className="ml-2 bg-brand-primary-100 text-brand-primary-800 text-xs px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-brand-neutral-600 mt-1">
                          {address.street}, {address.city}, {address.state}{" "}
                          {address.postalCode}
                        </p>
                        <p className="text-sm text-brand-neutral-600">
                          {address.country}
                        </p>
                        <p className="text-sm text-brand-neutral-600 mt-1">
                          {address.phone}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => editAddress(address)}
                          disabled={isProcessing}
                          className="p-1 text-brand-neutral-400 hover:text-brand-primary-600 transition-colors disabled:opacity-50"
                          title="Edit address"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={isProcessing}
                          className="p-1 text-brand-neutral-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(address.id)}
                        disabled={isProcessing}
                        className="text-sm text-brand-primary-600 hover:text-brand-primary-700 font-medium disabled:opacity-50"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// dashboard/addresses/page.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import {
  Search,
  MapPin,
  User,
  Home,
  Eye,
  Trash2,
  Loader2,
  X,
  Phone,
  Mail,
  Filter,
} from "lucide-react";

// Types
interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  user: {
    email: string;
    name?: string;
  };
}

interface AddressesResponse {
  addresses: Address[];
  isAdmin?: boolean;
}

// Skeleton Loading Component
const AddressSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded w-12"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex justify-end space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AddressesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch addresses with SWR
  const { data, error, mutate } = useSWR<AddressesResponse>(
    "/api/addresses",
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
    }
  );

  const addresses = data?.addresses || [];
  const isAdmin = data?.isAdmin || false;

  // Get unique cities and users for filters
  const cities = ["all", ...Array.from(new Set(addresses.map((a) => a.city)))];
  const users = [
    "all",
    ...Array.from(new Set(addresses.map((a) => a.user.email))),
  ];

  // FIXED: Proper filtering logic
  const filteredAddresses = addresses.filter((address) => {
    const searchLower = searchTerm.toLowerCase();

    // Search across all relevant fields
    const matchesSearch =
      address.firstName.toLowerCase().includes(searchLower) ||
      address.lastName.toLowerCase().includes(searchLower) ||
      address.street.toLowerCase().includes(searchLower) ||
      address.city.toLowerCase().includes(searchLower) ||
      address.phone.toLowerCase().includes(searchLower) || // Fixed: phone search
      address.user.email.toLowerCase().includes(searchLower); // Search by user email

    const matchesCity = selectedCity === "all" || address.city === selectedCity;
    const matchesUser =
      selectedUser === "all" || address.user.email === selectedUser;

    return matchesSearch && matchesCity && matchesUser;
  });

  // View address details
  const handleViewAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  // Delete address
  const handleDeleteAddress = async (address: Address) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/addresses/${address.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete address");
      }

      await mutate();
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
      toast.success("Address deleted successfully");
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast.error(error.message || "Failed to delete address");
    } finally {
      setIsLoading(false);
    }
  };

  // Set as default address
  const handleSetDefault = async (address: Address) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/addresses/${address.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...address,
          isDefault: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update address");
      }

      await mutate();
      toast.success("Default address updated successfully");
    } catch (error: any) {
      console.error("Error setting default address:", error);
      toast.error(error.message || "Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (address: Address) => {
    setAddressToDelete(address);
    setIsDeleteModalOpen(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load addresses</p>
          <button
            onClick={() => mutate()}
            className="mt-4 px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? "All User Addresses" : "Addresses"}
        </h1>
        <p className="text-gray-600">
          {data
            ? `Managing ${filteredAddresses.length} address${
                filteredAddresses.length !== 1 ? "es" : ""
              }${isAdmin ? ` across ${users.length - 1} users` : ""}`
            : "Loading addresses..."}
        </p>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, street, city, phone, or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === "all" ? "All Cities" : city}
              </option>
            ))}
          </select>

          {/* Show user filter only for admin */}
          {isAdmin && (
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary-500 focus:border-brand-primary-500"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user) => (
                <option key={user} value={user}>
                  {user === "all" ? "All Users" : user}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Active filters info */}
        <div className="flex items-center mt-4 text-sm text-gray-600">
          <Filter className="w-4 h-4 mr-2" />
          <span>
            Showing {filteredAddresses.length} of {addresses.length} addresses
            {(selectedCity !== "all" || selectedUser !== "all") &&
              " (filtered)"}
          </span>
        </div>
      </div>

      {/* Addresses table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isAdmin ? "Customer & User" : "Customer"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!data ? (
                // Skeleton loading
                Array.from({ length: 5 }).map((_, index) => (
                  <AddressSkeleton key={index} />
                ))
              ) : filteredAddresses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ||
                      selectedCity !== "all" ||
                      selectedUser !== "all"
                        ? "No addresses match your filters"
                        : "No addresses found"}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAddresses.map((address) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {address.firstName} {address.lastName}
                          </div>
                          {isAdmin && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {address.user.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{address.street}</div>
                          <div>
                            {address.city}, {address.state} {address.postalCode}
                          </div>
                          <div className="text-gray-500">{address.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {address.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          address.isDefault
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {address.isDefault ? "Default" : "Secondary"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewAddress(address)}
                          className="text-brand-primary-600 hover:text-brand-primary-900 p-1 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSetDefault(address)}
                          disabled={address.isDefault || isLoading}
                          className="text-blue-600 hover:text-blue-900 p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Set as Default"
                        >
                          <Home className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(address)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 p-1 transition-colors disabled:opacity-50"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Address Details Modal */}
      {selectedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Address Details
              </h2>
              <button
                onClick={() => setSelectedAddress(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>
                      {selectedAddress.firstName} {selectedAddress.lastName}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-between">
                      <span className="font-medium">User Email:</span>
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {selectedAddress.user.email}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedAddress.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Street:</span>
                    <span>{selectedAddress.street}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">City:</span>
                    <span>{selectedAddress.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">State:</span>
                    <span>{selectedAddress.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Postal Code:</span>
                    <span>{selectedAddress.postalCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Country:</span>
                    <span>{selectedAddress.country}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Status
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Address Type:</span>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedAddress.isDefault
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedAddress.isDefault
                        ? "Default Address"
                        : "Secondary Address"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setSelectedAddress(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSetDefault(selectedAddress);
                  setSelectedAddress(null);
                }}
                disabled={selectedAddress.isDefault || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Set as Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && addressToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Delete Address
              </h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAddressToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this address? This action cannot
                be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium text-red-800">
                  {addressToDelete.firstName} {addressToDelete.lastName}
                </p>
                {isAdmin && (
                  <p className="text-red-700 text-sm">
                    {addressToDelete.user.email}
                  </p>
                )}
                <p className="text-red-700 text-sm">
                  {addressToDelete.street}, {addressToDelete.city}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAddressToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAddress(addressToDelete)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

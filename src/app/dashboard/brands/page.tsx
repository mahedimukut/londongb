// dashboard/brands/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
  Star,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  isFeatured: boolean;
  _count?: {
    products: number;
  };
}

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Skeleton Components
  const BrandRowSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
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

  const HeaderSkeleton = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-32 mt-4 sm:mt-0"></div>
    </div>
  );

  const SearchSkeleton = () => (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-full max-w-md"></div>
    </div>
  );

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dashboard/brands");

      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }

      const data = await response.json();
      setBrands(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error fetching brands:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBrandToDelete(null);
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;

    setIsDeleting(true);
    const deleteToast = toast.loading(`Deleting ${brandToDelete.name}...`, {
      position: "top-right",
    });

    try {
      const response = await fetch(
        `/api/dashboard/brands/${brandToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete brand");
      }

      // Refresh the brands list
      await fetchBrands();

      toast.update(deleteToast, {
        render: `${brandToDelete.name} deleted successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
      });

      closeDeleteModal();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete brand";

      toast.update(deleteToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
        hideProgressBar: false,
      });

      console.error("Error deleting brand:", err);
      setIsDeleting(false);
    }
  };

  const toggleFeatured = async (brandId: string, currentStatus: boolean) => {
    const updateToast = toast.loading("Updating brand...", {
      position: "top-right",
    });

    try {
      const response = await fetch(`/api/dashboard/brands/${brandId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFeatured: !currentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update brand");
      }

      // Refresh the brands list
      await fetchBrands();

      toast.update(updateToast, {
        render: `Brand ${
          !currentStatus ? "featured" : "unfeatured"
        } successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update brand";

      toast.update(updateToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
        hideProgressBar: false,
      });

      console.error("Error updating brand:", err);
    }
  };

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title={`Delete ${brandToDelete?.name}?`}
        description="Are you sure you want to delete this brand? This action cannot be undone. The associated logo will also be deleted from Cloudinary."
        isLoading={isDeleting}
      />

      {/* Loading State */}
      {isLoading ? (
        <>
          {/* Page header skeleton */}
          <HeaderSkeleton />

          {/* Search skeleton */}
          <SearchSkeleton />

          {/* Table skeleton */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </th>
                    <th className="px-6 py-3 text-right">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <BrandRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Page header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
              <p className="text-gray-600">Manage product brands</p>
            </div>
            <Link
              href="/dashboard/brands/new"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Brand
            </Link>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search brands..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-red-400 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Brands table or empty state */}
          {filteredBrands.length === 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No matching brands found" : "No brands yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? "Try adjusting your search term or create a new brand."
                    : "Get started by creating your first product brand."}
                </p>
                <Link
                  href="/dashboard/brands/new"
                  className="inline-flex items-center px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Brand
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Brand
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Slug
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Products
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Featured
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBrands.map((brand) => (
                      <tr
                        key={brand.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {brand.logo && (
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {brand.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block">
                            {brand.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">
                            {brand._count?.products || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              toggleFeatured(brand.id, brand.isFeatured)
                            }
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              brand.isFeatured
                                ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                                : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                            }`}
                            title={
                              brand.isFeatured
                                ? "Unfeature brand"
                                : "Feature brand"
                            }
                          >
                            <Star
                              className={`w-4 h-4 ${
                                brand.isFeatured ? "fill-current" : ""
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link href={`/brands/${brand.slug}`}>
                              <button
                                className="p-2 text-brand-primary-600 hover:text-brand-primary-900 hover:bg-brand-primary-50 rounded-lg transition-colors duration-200"
                                title="View Brand"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>

                            <Link href={`/dashboard/brands/${brand.id}/edit`}>
                              <button
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Edit Brand"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </Link>

                            <button
                              onClick={() => openDeleteModal(brand)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete Brand"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {filteredBrands.length} of {brands.length} brands
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

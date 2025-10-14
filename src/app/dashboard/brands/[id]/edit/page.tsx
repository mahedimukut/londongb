// dashboard/brands/[id]/edit/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, X, AlertCircle, ImageIcon, Star } from "lucide-react";
import Link from "next/link";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the Cloudinary upload result type
interface CloudinaryUploadResult {
  event?: string;
  info?: {
    secure_url: string;
  };
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  isFeatured: boolean;
}

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // In the useEffect where you fetch the brand data:
  useEffect(() => {
    // Fetch brand data
    const fetchBrand = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/dashboard/brands/${brandId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch brand");
        }

        const brand: Brand = await response.json();

        setFormData({
          name: brand.name,
          slug: brand.slug,
          description: brand.description || "",
        });

        // Handle the case where brand.logo could be undefined
        setImageUrl(brand.logo || null);

        setIsFeatured(brand.isFeatured);
      } catch (error) {
        console.error("Error fetching brand:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load brand"
        );
        toast.error("Failed to load brand", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (brandId) {
      fetchBrand();
    }
  }, [brandId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name if the slug hasn't been manually modified
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }));
    }
  };

  const handleUploadSuccess = useCallback(
    (result: CloudinaryUploadWidgetResults) => {
      // Handle the Cloudinary result with proper typing
      const event = result.event;
      const info = result.info as CloudinaryUploadResult["info"];

      if (event === "success" && info) {
        setImageUrl(info.secure_url);
        setIsUploading(false);
        toast.success("Logo uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
    []
  );

  const handleUploadError = useCallback((error: any) => {
    console.error("Upload error:", error);
    setError("Failed to upload logo. Please try again.");
    setIsUploading(false);
    toast.error("Failed to upload logo. Please try again.", {
      position: "top-right",
      autoClose: 4000,
    });
  }, []);

  const removeImage = () => {
    setImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name.trim() || !formData.slug.trim()) {
        throw new Error("Name and slug are required");
      }

      // Send brand data to API
      const response = await fetch(`/api/dashboard/brands/${brandId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          logo: imageUrl,
          isFeatured: isFeatured,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update brand");
      }

      const brand = await response.json();

      // Show success message
      toast.success(`${brand.name} updated successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect to brands list after a short delay
      setTimeout(() => {
        router.push("/dashboard/brands");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error updating brand:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the brand";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-600"></div>
      </div>
    );
  }

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

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/brands"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Brands
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
          <p className="text-gray-600">Update brand details</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  required
                  disabled={isSaving}
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  required
                  disabled={isSaving}
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will be used in the URL. Use lowercase letters, numbers,
                  and hyphens.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                disabled={isSaving}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Logo
              </label>

              {imageUrl ? (
                <div className="flex flex-col items-start space-y-4">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Brand logo preview"
                      className="w-32 h-32 object-contain rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-green-600">
                    ✓ Logo uploaded successfully
                  </p>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset="ml_default"
                  onSuccess={handleUploadSuccess}
                  onError={handleUploadError}
                  onOpen={() => setIsUploading(true)}
                  options={{
                    multiple: false,
                    folder: "britcartbd/brands",
                    sources: ["local"],
                    maxFiles: 1,
                  }}
                >
                  {({ open }) => (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => open()}
                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-primary-400 bg-gray-50 transition-colors"
                        disabled={isSaving || isUploading}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-600 mb-2"></div>
                            <p className="text-xs text-gray-500">
                              Uploading...
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-xs text-gray-500">Upload Logo</p>
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </CldUploadWidget>
              )}

              <p className="mt-2 text-xs text-gray-500">
                Recommended size: 300x300 pixels. JPG, PNG, or WebP format.
              </p>
            </div>

            {/* Featured Brand */}
            <div className="flex items-center">
              <input
                id="isFeatured"
                name="isFeatured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500 border-gray-300 rounded"
                disabled={isSaving}
              />
              <label
                htmlFor="isFeatured"
                className="ml-2 flex items-center text-sm text-gray-900"
              >
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                Feature this brand on the homepage
              </label>
            </div>
          </div>

          {/* Form actions */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href="/dashboard/brands"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:opacity-50"
              onClick={(e) => isSaving && e.preventDefault()}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-primary-600 border border-transparent rounded-md shadow-sm hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Brand
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

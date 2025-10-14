// dashboard/categories/new/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, AlertCircle, ImageIcon } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";

// Define the upload result type
interface UploadResult {
  event: string;
  info: {
    secure_url: string;
  };
}

export default function NewCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name
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

  const handleUploadSuccess = useCallback((result: any) => {
    // More defensive approach
    if (result?.event === "success" && result?.info?.secure_url) {
      setImageUrl(result.info.secure_url);
      setIsUploading(false);
    }
  }, []);

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
    setError(null);
  }, []);

  const handleUploadError = useCallback((error: any) => {
    console.error("Upload error:", error);
    setError("Failed to upload image. Please try again.");
    setIsUploading(false);
  }, []);

  const removeImage = () => {
    setImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name.trim() || !formData.slug.trim()) {
        throw new Error("Name and slug are required");
      }

      if (!imageUrl) {
        throw new Error("Please upload a category image");
      }

      // Send category data to API
      const response = await fetch("/api/dashboard/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      // Redirect to categories list
      router.push("/dashboard/categories");
      router.refresh();
    } catch (error) {
      console.error("Error creating category:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the category"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/categories"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Categories
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600">Create a new product category</p>
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
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  required
                  placeholder="e.g., Baby Toys"
                  disabled={isLoading}
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
                  placeholder="e.g., baby-toys"
                  disabled={isLoading}
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
                placeholder="Describe this category..."
                disabled={isLoading}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Image *
              </label>

              {imageUrl ? (
                <div className="flex flex-col items-start space-y-4">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-green-600">
                    ✓ Image uploaded successfully
                  </p>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset="ml_default"
                  onSuccess={handleUploadSuccess}
                  onError={handleUploadError}
                  onOpen={handleUploadStart}
                  options={{
                    multiple: false,
                    folder: "britcartbd/categories",
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
                        disabled={isLoading || isUploading}
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
                            <p className="text-xs text-gray-500">
                              Upload Image
                            </p>
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
          </div>

          {/* Form actions */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href="/dashboard/categories"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:opacity-50"
              onClick={(e) => isLoading && e.preventDefault()}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || !imageUrl}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-primary-600 border border-transparent rounded-md shadow-sm hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

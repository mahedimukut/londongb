"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  ImageIcon,
  Plus,
  Trash2,
  Star,
  Package,
} from "lucide-react";
import Link from "next/link";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CloudinaryUploadResult {
  event?: string;
  info?: { secure_url: string };
}

interface Category {
  id: string;
  name: string;
}
interface Brand {
  id: string;
  name: string;
}
interface Color {
  name: string;
  hexCode: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([
    { name: "", hexCode: "#000000" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    categoryId: "",
    brandId: "",
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    ageRange: "",
  });

  const [specifications, setSpecifications] = useState({
    brand: "",
    countryOfOrigin: "",
    productType: "",
    materials: "",
    packContains: "",
    weight: "",
    dimensions: "",
    careInstructions: "",
    safetyFeatures: "",
  });

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/dashboard/categories"),
          fetch("/api/dashboard/brands"),
        ]);

        if (!categoriesRes.ok || !brandsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();

        setCategories(categoriesData.categories || categoriesData || []);
        setBrands(brandsData.brands || brandsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load categories and brands");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "name") {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        setFormData((prev) => ({ ...prev, slug }));
      }
    }
  };

  const handleSpecificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSpecifications((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSuccess = useCallback(
    (result: CloudinaryUploadWidgetResults) => {
      const event = result.event;
      const info = result.info as CloudinaryUploadResult["info"];
      if (event === "success" && info) {
        setImageUrls((prev) => [...prev, info.secure_url]);
        setIsUploading(false);
        toast.success("Image uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
    []
  );

  const handleUploadError = useCallback((error: any) => {
    console.error("Upload error:", error);
    setError("Failed to upload image. Please try again.");
    setIsUploading(false);
    toast.error("Failed to upload image. Please try again.", {
      position: "top-right",
      autoClose: 4000,
    });
  }, []);

  const removeImage = (index: number) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== index));

  const handleColorChange = (
    index: number,
    field: keyof Color,
    value: string
  ) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const addColor = () =>
    setColors([...colors, { name: "", hexCode: "#000000" }]);
  const removeColor = (index: number) =>
    colors.length > 1 && setColors(colors.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (
        !formData.name.trim() ||
        !formData.slug.trim() ||
        !formData.price ||
        !formData.stock ||
        !formData.categoryId
      ) {
        throw new Error("Name, slug, price, stock, and category are required");
      }
      if (imageUrls.length === 0)
        throw new Error("Please upload at least one product image");

      const response = await fetch("/api/dashboard/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
          colors: colors.filter((c) => c.name.trim() !== ""),
          specifications: Object.values(specifications).some(
            (v) => v.trim() !== ""
          )
            ? specifications
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      const product = await response.json();
      toast.success(`${product.name} created successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        router.push("/dashboard/products");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the product";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right", autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading categories and brands...</p>
        </div>
      </div>
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

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/products"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product listing</p>
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
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                    required
                    placeholder="e.g., Super Building Blocks"
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
                    placeholder="e.g., super-building-blocks"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This will be used in the URL. Use lowercase letters,
                    numbers, and hyphens.
                  </p>
                </div>
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
                placeholder="Describe this product..."
                disabled={isLoading}
              />
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="brandId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand
                </label>
                <select
                  id="brandId"
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  disabled={isLoading}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                    required
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="originalPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                    required
                    placeholder="0"
                    min="0"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* SKU & Age Range */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  placeholder="e.g., PROD-001"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="ageRange"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age Range
                </label>
                <input
                  type="text"
                  id="ageRange"
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                  placeholder="e.g., 3-8 years"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images *
              </label>

              {imageUrls.length > 0 ? (
                <div className="flex flex-wrap gap-4 mb-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-32 h-32 object-contain rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <CldUploadWidget
                uploadPreset="ml_default"
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
                onOpen={() => setIsUploading(true)}
                options={{
                  multiple: true,
                  folder: "britcartbd/products",
                  sources: ["local"],
                  maxFiles: 6,
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
                          <p className="text-xs text-gray-500">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-xs text-gray-500">Upload Images</p>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </CldUploadWidget>

              <p className="mt-2 text-xs text-gray-500">
                Upload up to 6 images. Recommended size: 800x800 pixels. JPG,
                PNG, or WebP format.
              </p>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Colors
              </label>

              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Color Name"
                    value={color.name}
                    onChange={(e) =>
                      handleColorChange(index, "name", e.target.value)
                    }
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                    disabled={isLoading}
                  />
                  <input
                    type="color"
                    value={color.hexCode}
                    onChange={(e) =>
                      handleColorChange(index, "hexCode", e.target.value)
                    }
                    className="w-12 h-10 border border-gray-300 rounded-md"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                    disabled={isLoading || colors.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addColor}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-brand-primary-700 bg-brand-primary-100 rounded-md hover:bg-brand-primary-200 disabled:opacity-50"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Color
              </button>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Specifications
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700 mb-1 capitalize"
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleSpecificationChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Flags */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Product Flags
              </h2>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 flex items-center text-sm text-gray-900"
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    Feature this product
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isBestSeller"
                    name="isBestSeller"
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="isBestSeller"
                    className="ml-2 text-sm text-gray-900"
                  >
                    Best Seller
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isNew"
                    name="isNew"
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-primary-600 focus:ring-brand-primary-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="isNew" className="ml-2 text-sm text-gray-900">
                    New Arrival
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href="/dashboard/products"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:opacity-50"
              onClick={(e) => isLoading && e.preventDefault()}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading || !imageUrls.length}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-primary-600 border border-transparent rounded-md shadow-sm hover:bg-brand-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

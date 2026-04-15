"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Search, SlidersHorizontal, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  category: string;
  images: string[];
  inStock: boolean;
  rating: number;
  features: string[];
}

const categoryLabels: Record<string, string> = {
  "": "All Products",
  PAIN_RELIEF: "Pain Relief",
  MASSAGE_GUNS: "Massage Guns",
  POSTURE_CORRECTORS: "Posture Correctors",
  SLIPPERS: "Posture Slippers",
  ACCESSORIES: "Accessories",
  EXERCISE_EQUIPMENT: "Exercise Equipment",
};

const categoryColors: Record<string, string> = {
  "PAIN_RELIEF": "from-teal-400 to-emerald-500",
  "MASSAGE_GUNS": "from-indigo-400 to-blue-500",
  "POSTURE_CORRECTORS": "from-amber-400 to-orange-500",
  "SLIPPERS": "from-pink-400 to-rose-500",
  "ACCESSORIES": "from-purple-400 to-violet-500",
  "EXERCISE_EQUIPMENT": "from-cyan-400 to-blue-500",
};

function ShopPageContent() {
  const searchParamsHook = useSearchParams();
  const initialCategory = searchParamsHook.get("category") || "";
  const { addItem, totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("sort", sort);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0] || "",
      slug: product.slug,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-border/50">
        <div className="container-custom py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Recovery Shop</h1>
              <p className="text-muted-foreground">Premium physiotherapy products for your recovery journey</p>
            </div>
            <Link href="/shop/cart" className="btn btn-primary relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Search */}
          <form
            onSubmit={(e) => { e.preventDefault(); fetchProducts(); }}
            className="mt-6 flex gap-3 max-w-lg"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input pl-11"
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === key
                  ? "bg-primary text-white shadow-md"
                  : "bg-secondary text-muted-foreground hover:bg-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${products.length} products`}
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-32 skeleton" />
                  <div className="h-5 w-20 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Products will appear here once added by admin.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon for premium recovery products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden card-hover group"
              >
                <Link href={`/shop/${product.slug}`}>
                  <div className={`aspect-square relative bg-gradient-to-br ${categoryColors[product.category] || "from-gray-200 to-gray-300"} flex items-center justify-center`}>
                    <ShoppingBag className="w-12 h-12 text-white/40" />
                    {product.salePrice && (
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-destructive flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                        </span>
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {product.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">{formatPrice(product.salePrice)}</span>
                          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        addedId === product.id
                          ? "bg-green-500 text-white"
                          : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      {addedId === product.id ? "✓" : <ShoppingCart className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-border/50">
            <div className="container-custom py-10">
              <div className="h-10 w-48 skeleton mb-2" />
              <div className="h-5 w-72 skeleton" />
            </div>
          </div>
          <div className="container-custom py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="aspect-square skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-32 skeleton" />
                    <div className="h-5 w-20 skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}

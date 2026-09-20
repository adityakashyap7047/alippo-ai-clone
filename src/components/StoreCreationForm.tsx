"use client";
import { useState } from "react";
import { Sparkles, Store, ArrowRight, CheckCircle } from "lucide-react";

const categories = [
  "Electronics", "Clothing", "Accessories", "Home & Kitchen", "Beauty",
  "Sports", "Stationery", "Food & Beverage", "Pet Supplies", "Religious & Ceremonial", "Other"
];

export default function StoreCreationForm({ onComplete }: { onComplete: (name: string, category: string) => void }) {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!storeName || !category) return;
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 2000));
    onComplete(storeName, category);
  };

  if (isCreating) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="animate-slide-up space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary animate-pulse-slow">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Building your store...</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CheckCircle className="h-5 w-5 text-success" /> Creating product pages
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <CheckCircle className="h-5 w-5 text-success" /> Setting up payments
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: "1s" }}>
              <CheckCircle className="h-5 w-5 text-success" /> Configuring your AI co-founder
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: "1.4s" }}>
              <CheckCircle className="h-5 w-5 text-success" /> Launching your store
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {step === 1 && (
        <div className="animate-slide-up space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">What are you selling?</h3>
            <p className="mt-2 text-gray-500">I&apos;ll build your store around that.</p>
          </div>

          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g. Urban Fashion Co."
            className="w-full rounded-xl border-2 border-gray-200 px-5 py-4 text-lg text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none"
            autoFocus
          />

          <div className="flex justify-end">
            <button
              onClick={() => storeName && setStep(2)}
              disabled={!storeName}
              className="flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              Next <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-slide-up space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Pick a category</h3>
            <p className="mt-2 text-gray-500">Choose what best describes your store.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  category === cat
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-600 transition-all hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleCreate}
              disabled={!category}
              className="flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Sparkles className="h-5 w-5" /> Create Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

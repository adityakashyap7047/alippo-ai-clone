"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Store, ArrowRight, Zap, ShoppingCart, Bot, Shield, Clock, Star } from "lucide-react";
import StoreCreationForm from "@/components/StoreCreationForm";
import { createStore, getStore, generateSampleData } from "@/lib/store";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [storeExists, setStoreExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const store = getStore();
    if (store) setStoreExists(true);
  }, []);

  const handleStoreCreated = (name: string, category: string) => {
    createStore(name, category, "Your AI-powered store");
    generateSampleData();
    router.push("/dashboard");
  };

  const features = [
    { icon: Zap, title: "60-Second Setup", desc: "Your store goes live in under a minute. No coding required." },
    { icon: Bot, title: "AI Co-founder", desc: "An AI that runs your store, recovers carts, and suggests strategies." },
    { icon: ShoppingCart, title: "Smart Cart Recovery", desc: "Automatically reminds customers who left items in their cart." },
    { icon: Shield, title: "Secure Payments", desc: "Built-in payment processing with bank-level security." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white font-bold text-sm">A</div>
            <span className="text-xl font-bold text-gray-900">Alippo</span>
          </div>
          <div className="flex items-center gap-4">
            {storeExists ? (
              <Link href="/dashboard" className="rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105">
                Go to Dashboard
              </Link>
            ) : (
              <button onClick={() => setShowForm(true)} className="rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105">
                Start Free
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> AI-Powered E-commerce
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Your AI cofounder<br />
              <span className="gradient-primary bg-clip-text text-transparent">that runs your store</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
              I will remind customers who left their cart, launch a flash sale while you sleep, and help you grow your business — all powered by AI.
            </p>

            {!showForm ? (
              <div className="mt-10">
                <button
                  onClick={() => setShowForm(true)}
                  className="group inline-flex items-center gap-2 rounded-2xl gradient-primary px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:scale-105"
                >
                  <Store className="h-5 w-5" />
                  Build Your Store
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-4 text-sm text-gray-400">No signup required &middot; Store live in 60 seconds &middot; Ready to take orders</p>
              </div>
            ) : (
              <div className="mt-12">
                <StoreCreationForm onComplete={handleStoreCreated} />
              </div>
            )}
          </div>
        </div>

        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-white via-primary/10 to-transparent rounded-full blur-3xl"></div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to sell online</h2>
            <p className="mt-4 text-lg text-gray-500">From storefront to AI-powered growth tools</p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl gradient-primary p-12 text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to launch your store?</h2>
            <p className="mt-4 text-lg text-white/80">Join thousands of entrepreneurs building with AI</p>
            <div className="mt-8 flex items-center justify-center gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-300 text-yellow-300" />
              ))}
            </div>
            <p className="mt-2 text-sm text-white/70">Rated 4.9/5 by store owners</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-primary shadow-xl transition-all hover:scale-105"
            >
              <Clock className="h-5 w-5" /> Start in 60 Seconds
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white font-bold text-xs">A</div>
            <span className="text-lg font-bold text-gray-900">Alippo</span>
          </div>
          <p className="mt-4 text-sm text-gray-400">Your AI cofounder that builds and runs your store</p>
        </div>
      </footer>
    </div>
  );
}

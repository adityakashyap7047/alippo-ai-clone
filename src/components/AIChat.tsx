"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ShoppingCart, TrendingUp, Megaphone, AlertTriangle } from "lucide-react";
import { getStore, getAnalytics } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: "Cart Abandonment", icon: ShoppingCart, prompt: "Show me customers who abandoned their carts" },
  { label: "Sales Insights", icon: TrendingUp, prompt: "Give me insights about my sales performance" },
  { label: "Marketing Ideas", icon: Megaphone, prompt: "Suggest marketing strategies for my store" },
  { label: "Alerts", icon: AlertTriangle, prompt: "Any alerts or issues I should know about?" },
];

function generateAIResponse(userMessage: string): string {
  const store = getStore();
  const analytics = getAnalytics();
  const msg = userMessage.toLowerCase();

  if (msg.includes("cart") && (msg.includes("abandon") || msg.includes("left"))) {
    const n = Math.floor(Math.random() * 15) + 3;
    const r = Math.floor(Math.random() * 5) + 1;
    return "I found " + n + " customers who left items in their cart in the last 24 hours.\n\nHere is what I recommend:\n\n1. **Send a reminder email** - I can draft one for you right now\n2. **Offer a 10% discount** - This typically recovers " + r + "-" + n + " of abandoned carts\n3. **Create urgency** - Your items are selling fast messaging\n\nWould you like me to send a cart recovery campaign?";
  }

  if (msg.includes("sales") && (msg.includes("insight") || msg.includes("performance"))) {
    if (!analytics) return "I don't have enough data yet. Start making sales and I will analyze them for you!";
    return "Here is your sales snapshot:\n\n**Revenue:** $" + analytics.totalRevenue.toFixed(2) + "\n**Orders:** " + analytics.totalOrders + "\n**Products Sold:** " + analytics.totalSales + "\n\n**Top Recommendation:** Your " + analytics.totalProducts + " products are generating good traction. Consider:\n\n1. Bundle related products for higher average order value\n2. Run a flash sale on slow-moving inventory\n3. Add 2-3 new products based on current trends\n\nWant me to set up a flash sale campaign?";
  }

  if (msg.includes("marketing") || msg.includes("promot") || msg.includes("strateg")) {
    return "Here are tailored marketing strategies for your store:\n\n**Quick Wins:**\n1. **Social Proof** - Add customer reviews to product pages\n2. **Urgency Tactics** - Only 5 left! on low-stock items\n3. **Email Campaigns** - Weekly newsletter with new arrivals\n\n**Growth Strategies:**\n1. **Referral Program** - Give $10, Get $10\n2. **Instagram Shopping** - Tag products in posts\n3. **Google Shopping Ads** - Target high-intent buyers\n\n**AI Power Move:** I can auto-generate social media posts and schedule them. Want me to create a content calendar?";
  }

  if (msg.includes("alert") || msg.includes("issue") || msg.includes("problem")) {
    if (!analytics) return "All systems are running smoothly! No alerts at this time.";
    const alerts: string[] = [];
    if (analytics.pendingOrders > 0) alerts.push(analytics.pendingOrders + " orders need processing");
    const lowStock = store?.products.filter((p) => p.inventory < 10) || [];
    if (lowStock.length > 0) alerts.push(lowStock.length + " products are low on stock: " + lowStock.map((p) => p.name).join(", "));
    if (alerts.length === 0) alerts.push("All clear! No issues to report.");
    return "Here is what needs your attention:\n\n" + alerts.join("\n\n") + "\n\nI will keep monitoring and alert you if anything changes.";
  }

  if (msg.includes("flash") && msg.includes("sale")) {
    return "**Flash Sale Setup**\n\nI will create a flash sale for you:\n\n**Recommended Settings:**\n- Duration: 24 hours\n- Discount: 15-25% off\n- Target: All products or bestsellers\n\n**I will also:**\n1. Create a countdown timer on your store\n2. Send email notifications to past customers\n3. Post on social media channels\n4. Send cart abandonment reminders with the sale\n\nShall I launch this flash sale now?";
  }

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hey there! I am your AI co-founder. Here is what I can help you with today:\n\n- **Analyze sales** - See what is working and what is not\n- **Recover carts** - Win back customers who left items\n- **Launch promotions** - Flash sales, discounts, bundles\n- **Marketing** - Social media posts, email campaigns\n- **Inventory** - Stock alerts and reorder suggestions\n\nWhat would you like to tackle?";
  }

  if (msg.includes("help")) {
    return "I am here to help you grow your business! Here are some things I can do:\n\n**E-commerce:**\n- Cart recovery campaigns\n- Product recommendations\n- Pricing optimization\n\n**Analytics:**\n- Sales trends and forecasts\n- Customer behavior insights\n- Revenue projections\n\n**Marketing:**\n- Social media content\n- Email campaigns\n- Ad copy generation\n\n**Operations:**\n- Inventory management\n- Order processing\n- Customer support drafting\n\nJust ask me anything!";
  }

  const responses = [
    "Great question! Based on your store data, I would suggest focusing on increasing your average order value. You could:\n\n1. Create product bundles\n2. Add Frequently Bought Together recommendations\n3. Set free shipping thresholds\n\nWant me to implement any of these?",
    "I have analyzed your store performance. Here are my top 3 recommendations:\n\n1. **Optimize product images** - High-quality images increase conversions by 25%\n2. **Add social proof** - Customer reviews build trust\n3. **Improve mobile experience** - 60% of traffic is mobile\n\nShall I help you with any of these?",
    "Based on current market trends, here is what I recommend for your store:\n\n**Trending Now:**\n- Sustainable and eco-friendly products\n- Personalized items\n- Bundle deals\n\nI can help you create product listings that tap into these trends. Want to explore?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hey! I am your AI co-founder. I am here to help you run and grow your store. Ask me anything about sales, marketing, inventory, or strategy!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: generateAIResponse(text), timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Co-founder</h3>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "gradient-primary text-white rounded-br-md"
                : "bg-gray-100 text-gray-800 rounded-bl-md"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }}></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }}></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.prompt)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI co-founder anything..."
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

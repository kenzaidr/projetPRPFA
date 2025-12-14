import React, { useState } from "react";
import { ShoppingCart, Star, Flame, Leaf } from "lucide-react";

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  tag?: "popular" | "spicy" | "vegan";
}

const foods: FoodItem[] = [
  {
    id: 1,
    name: "Tajine Poulet",
    description: "Poulet mijoté aux olives et citron confit",
    price: 45,
    image: "/images/tajine-poulet.jpg",
    rating: 4.7,
    tag: "popular",
  },
  {
    id: 2,
    name: "Couscous Royal",
    description: "Semoule, légumes et viandes variées",
    price: 60,
    image: "/images/couscous.jpg",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Pastilla",
    description: "Feuilleté sucré-salé au poulet et amandes",
    price: 55,
    image: "/images/pastilla.jpg",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Harira",
    description: "Soupe marocaine traditionnelle",
    price: 20,
    image: "/images/harira.jpg",
    rating: 4.5,
    tag: "vegan",
  },
];

const Food: React.FC = () => {
  const [cart, setCart] = useState<FoodItem[]>([]);

  const addToCart = (food: FoodItem) => {
    setCart([...cart, food]);
  };

  const renderTagIcon = (tag?: FoodItem["tag"]) => {
    if (tag === "popular") return <Star className="w-4 h-4 text-yellow-400" />;
    if (tag === "spicy") return <Flame className="w-4 h-4 text-red-500" />;
    if (tag === "vegan") return <Leaf className="w-4 h-4 text-green-500" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-red-50 p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-green-700">🍽️ MMKH Food</h1>
        <div className="relative">
          <ShoppingCart className="w-7 h-7 text-red-600" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={food.image}
              alt={food.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {food.name}
                </h2>
                {renderTagIcon(food.tag)}
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {food.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-green-700 font-bold">
                  {food.price} DH
                </span>
                <button
                  onClick={() => addToCart(food)}
                  className="bg-red-600 text-white px-3 py-1 rounded-xl text-sm hover:bg-red-700 transition"
                >
                  Ajouter
                </button>
              </div>

              <div className="mt-2 text-sm text-yellow-500">
                ⭐ {food.rating}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Food;
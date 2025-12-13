export default function RestaurantList() {
  const restaurants = ["Tagine Express", "Casa Food", "Marrakech Saveurs"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-green-700">
        Restaurants populaires
      </h2>
      <div className="grid gap-4">
        {restaurants.map(r => (
          <div key={r} className="p-4 bg-white rounded shadow">
            🍽️ {r}
          </div>
        ))}
      </div>
    </div>
  );
}

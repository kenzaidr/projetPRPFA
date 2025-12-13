export default function RideForm() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-green-600 mb-4">
        Commander une course
      </h2>
      <input className="border p-2 w-full mb-3" placeholder="Départ" />
      <input className="border p-2 w-full mb-3" placeholder="Destination" />
      <button className="bg-red-600 text-white px-4 py-2 rounded">
        Commander
      </button>
    </div>
  );
}

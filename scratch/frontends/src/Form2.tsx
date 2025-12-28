import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

export const Form2 = () => {
  const [search, setSearch] = useState("");
  const [debounce, setDebounce] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", debounce],
    queryFn: async () => {
      const url = debounce
        ? `https://dummyjson.com/recipes/search?q=${debounce}`
        : `https://dummyjson.com/recipes`;
      const res = await axios.get(url);
      return res.data;
    },
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error occurred</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipes</h1>

      <input
        type="text"
        value={search}
        placeholder="Search Recipes"
        className="w-1/2 px-2 border py-3 rounded-xl mb-4 flex mx-auto "
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.recipes?.map((post) => (
          <li
            key={post.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            {/* Recipe Image */}
            <img
              src={post.image}
              alt={post.name}
              className="w-full h-48 object-cover"
            />

            {/* Card Body */}
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-semibold mb-2">{post.name}</h2>

              {/* Tags / Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {post.mealType?.map((meal) => (
                  <span
                    key={meal}
                    className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full font-medium"
                  >
                    {meal}
                  </span>
                ))}
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  {post.difficulty}
                </span>
              </div>

              {/* Ingredients */}
              <p className="font-medium mt-2 mb-3">Ingredients:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-2 max-h-30 overflow-auto">
                {post.ingredients?.map((ing) => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>

              {/* Instructions */}
              <p className="font-medium mt-2">Instructions:</p>
              <ul className="list-decimal list-inside text-sm text-gray-700 mb-2 max-h-36 overflow-auto">
                {post.instructions?.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>

              {/* Additional Info */}
              <div className="mt-auto pt-2 border-t border-gray-200 flex flex-col gap-1 text-sm text-gray-600">
                <span>
                  ⏱ Prep: {post.prepTimeMinutes} min | Cook:{" "}
                  {post.cookTimeMinutes} min
                </span>
                <span>🍽 Servings: {post.servings}</span>
                <span>🔥 Calories: {post.caloriesPerServing}</span>
                <span>🌍 Cuisine: {post.cuisine}</span>
                <span>
                  ⭐ Rating: {post.rating} ({post.reviewCount} reviews)
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
interface Recipe {
  id: number;
  name: string;
  image: string;
  tags?: string[];
  mealType?: string[];
  ingredients?: string[];
  instructions?: string[];
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  cuisine: string;
  rating: number;
  reviewCount: number;
}

export const Form2 = () => {
  const [search, setSearch] = useState<string>("");
  const [debounce, setDebounce] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postPerPage = 6;

  const { data, isLoading, error } = useQuery<Recipe[]>({
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

  const recipes: Recipe[] = data?.recipes || [];
  const totalPages = Math.ceil(recipes.length / postPerPage);
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts: Recipe[] = recipes.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error occurred</div>;

  const handleEdit = async (id: number) => {
    const res = await axios.put(`https://dummyjson.com/recipes/${id}`, {
      name: "updated Recipe Name",
    });
    console.log("Edited:", res.data);
    return res.data;
  };

  const handleDelete = async (id: number) => {
    const res = await axios.delete(`https://dummyjson.com/recipes/${id}`);
    console.log("Deleted:", res.data);
    return res.data;
  };
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <div className="max-w-7xl mx-auto px-4 py-8 text-black dark:text-gray-500">
        <h1 className="text-3xl font-bold mb-6 text-center">Recipes</h1>

        <input
          type="text"
          value={search}
          placeholder="Search Recipes"
          className="w-1/2 px-2 border py-3 rounded-xl mb-4 flex mx-auto "
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {currentPosts.map((post: Recipe) => (
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
                  {post.ingredients?.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
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
                <div className="gap-4 flex ">
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 w-1/2  bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700 transition"
                    onClick={() => handleEdit(post.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 w-1/2 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700 transition"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === page ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

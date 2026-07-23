

import logo from "../../Images/logo_img.png";
import foods from "../../Images/food.png";


export default function landingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <nav className="sticky top-0 bg-[#FAF8F5]/90 backdrop-blur border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <img src={logo} alt="CookCraft" className="w-28" />
          <ul className="hidden lg:flex gap-10 font-medium text-gray-800">
            {["Home","Recipes","Categories","About","Contact"].map(i=>(
              <li key={i} className="hover:text-[#F38D39] cursor-pointer">{i}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <button className="bg-[#F38D39] text-white px-6 py-3 rounded-full hover:bg-[#e97c25] shadow">
              Get Started
            </button>
            <div className="bg-white rounded-full px-3 py-2 shadow flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F38D39] flex items-center justify-center text-white">
                <i className="fa-regular fa-circle-user"></i>
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-sm">My Account</p>
                <p className="text-xs text-gray-500">Login / Register</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-10 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2">
          <p className="uppercase tracking-[6px] text-[#F38D39] font-semibold mb-4">Welcome to CookCraft</p>
          <h1 className="text-6xl font-bold leading-tight">
            Discover Amazing <span className="text-[#F38D39]">Recipes</span>
          </h1>
          <p className="mt-8 text-lg leading-8 text-gray-600 max-w-xl">
            Explore hundreds of delicious recipes, discover new cuisines,
            save your favourite meals and share your own creations with the CookCraft community.
          </p>
          <div className="flex gap-5 mt-10">
            <button className="bg-[#F38D39] text-white px-8 py-4 rounded-full shadow hover:bg-[#e97c25]">Explore Recipes</button>
            <button className="border-2 border-[#F38D39] text-[#F38D39] px-8 py-4 rounded-full hover:bg-[#F38D39] hover:text-white">Browse Categories</button>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center relative mt-10 lg:mt-0">
          <div className="absolute w-[550px] h-[550px] rounded-full bg-orange-100 blur-3xl opacity-50"></div>
          <img
            src={foods}
            alt="Food"
            className="relative w-[700px] drop-shadow-2xl animate-spin"
            style={{animationDuration:"25s",animationTimingFunction:"linear"}}
          />
        </div>
      </section>

<section className="max-w-7xl mx-auto px-8 py-20">

  <div className="text-center">
    <h2 className="text-4xl font-bold">
      Admin <span className="text-[#F38D39]">Dashboard</span>
    </h2>

    <p className="text-gray-500 mt-4 text-lg">
      Manage your recipes, categories, and users efficiently from one place.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

    {/* Card 1 */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
        <i className="fa-solid fa-utensils text-3xl text-[#F38D39]"></i>
      </div>

      <h3 className="text-2xl font-bold mt-6">
        Manage Recipes
      </h3>

      <p className="text-gray-500 mt-3 leading-7">
        Add, edit, delete, and organize recipes with ease.
      </p>

    </div>

    {/* Card 2 */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
        <i className="fa-solid fa-layer-group text-3xl text-[#F38D39]"></i>
      </div>

      <h3 className="text-2xl font-bold mt-6">
        Categories
      </h3>

      <p className="text-gray-500 mt-3 leading-7">
        Create and organize recipe categories for better navigation.
      </p>

    </div>

    {/* Card 3 */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
        <i className="fa-solid fa-users text-3xl text-[#F38D39]"></i>
      </div>

      <h3 className="text-2xl font-bold mt-6">
        Manage Users
      </h3>

      <p className="text-gray-500 mt-3 leading-7">
        View registered users and monitor their activity.
      </p>

    </div>

    {/* Card 4 */}
    <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
        <i className="fa-solid fa-chart-line text-3xl text-[#F38D39]"></i>
      </div>

      <h3 className="text-2xl font-bold mt-6">
        Dashboard Insights
      </h3>

      <p className="text-gray-500 mt-3 leading-7">
        Monitor recipes, categories, and user activity through the dashboard.
      </p>

    </div>

  </div>

</section>


    </div>
  );
}

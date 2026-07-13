import logo from "../Images/logo_img.png";
import foods from "../Images/food.png";



function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] overflow-hidden">

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">

        {/* Logo */}
        <img
          src={logo}
          alt="CookCraft Logo"
          className="w-44 cursor-pointer"
        />

        {/* Navigation */}
        <ul className="flex items-center gap-8 text-[17px] font-medium">
          <li className="cursor-pointer transition-colors duration-300 hover:text-[#F38D39]">Home</li>

          <li className="cursor-pointer transition-colors duration-300 hover:text-[#F38D39]">
            Recipes
          </li>

          <li className="cursor-pointer transition-colors duration-300 hover:text-[#F38D39]">
            Categories
          </li>

          <li>
            <button className="flex items-center gap-2 bg-[#F38D39] text-white px-6 py-3 rounded-full hover:bg-[#E67820] transition-all duration-300 shadow-md cursor-pointer">
              <i className="fa-solid fa-plus"></i>
              Add Recipe
            </button>
          </li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-md">
          <i className="fa-regular fa-heart text-2xl cursor-pointer hover:text-[#F38D39] transition-colors duration-300"></i>

          <i className="fa-regular fa-circle-user text-2xl cursor-pointer hover:text-[#F38D39] transition-colors duration-300"></i>
        </div>
      </nav>

      {/*  Search */}
      <div className="flex justify-center items-center gap-4 mt-8 px-6">

        <div className="flex items-center w-full max-w-xl h-14 bg-white border border-gray-300 rounded-2xl px-5 shadow-sm">

          <i className="fa-solid fa-magnifying-glass text-gray-500 text-lg mr-3"></i>

          <input
            type="text"
            placeholder="Search by recipe or ingredients"
            className="w-full outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <button className="px-8 h-14 rounded-2xl bg-[#F38D39] text-white font-semibold hover:bg-[#E67820] transition-all duration-300 shadow-md cursor-pointer">
          Search
        </button>
      </div>

      {/* Hero*/}
<section className="max-w-7xl mx-auto flex items-center justify-between px-6 min-h-[80vh]">

        {/* Left */}
<div className="max-w-xl lg:ml-12">
          <h2 className="text-[#F38D39] text-lg font-semibold tracking-widest mb-3">
            WELCOME TO COOKCRAFT!
          </h2>

          <h1 className="text-6xl font-bold leading-tight text-gray-900 mb-6">
            Cook Something
            <br />
            <span className="text-[#F38D39]">
              Amazing Today
            </span>
          </h1>

          <p className="text-gray-600 text-lg leading-8 mb-10">
            From quick breakfasts to gourmet dinners, discover delicious
            recipes, cook with confidence, and share your own creations with
            CookCraft.
          </p>

          <div className="flex gap-5">

            <button className="bg-[#F38D39] hover:bg-[#E67820] text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
              Explore Recipes
            </button>

            <button className="border-2 border-[#F38D39] text-[#F38D39] hover:bg-[#F38D39] hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 cursor-pointer">
              Search
            </button>

          </div>
        </div>

{/* Right */}
    <div className="flex justify-end flex-1">
      <img
        src={foods}
        alt="Food"
        className="w-[900px] lg:w-[1000px] xl:w-[1100px] 2xl:w-[1200px] drop-shadow-2xl animate-spin"
        style={{
          animationDuration: "25s",
          animationTimingFunction: "linear",
        }}
      />

    </div>

      </section>
    </div>
  );
}

export default Dashboard;
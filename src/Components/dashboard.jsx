import "./Dashboard.css";
import logo from "../Images/logo_img.png";
import foods from "../Images/food_rotate.png";

function Dashboard() {
  return (
    <>
      <nav className="nav">
        <div className="logo">
          <img src={logo} alt="CookCraft Logo" className="logo_img" />
        </div>

        <div className="nav_list">
          <ul>
            <li className="active">Home</li>
            <li>Recipes</li>
            <li>Categories</li>

            <li>
              <button className="Addbtn">
                <i className="fa-solid fa-plus"></i>
                Add Recipe
              </button>
            </li>
          </ul>
        </div>

        <div className="icons">
          <i className="fa-regular fa-heart"></i>
          <i className="fa-regular fa-circle-user"></i>
        </div>
      </nav>

      <div className="search-container">
        <div className="search-box">
          <i className="fa-brands fa-sistrix"></i>
          <input
            type="text"
            placeholder="Search by recipe or ingredients"
          />
        </div>

        <button className="search-btn">Search</button>
      </div>

      <div className="food-image">
        <img src={foods} alt="Food" />
      </div>

      <div className="welcome">
        <h2>WELCOME TO COOKCRAFT!</h2>

        <h1>
          Cook Something <br />
          <span>Amazing Today</span>
        </h1>

        <p>
          From quick breakfasts to gourmet dinners, discover delicious recipes,
          cook with confidence, and share your own creations with CookCraft.
        </p>

        <div className="btns">
          <button className="explore-btn">Explore Recipes</button>
          <button className="Search-btn">Search</button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
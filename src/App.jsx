
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Frontend/login";
import SignUpPage from "./Components/Frontend/Signup";
import LandingPage from "./Components/Frontend/LandingPage";
import CookCraftHome from "./Components/Frontend/Home";
import AdminDashboard from "./Components/Frontend/AdminDashboard";
import AddRecipe from "./Components/Frontend/AddRecipes";
import RecipePage from "./Components/Frontend/RecipePage";
import CategorytPage from "./Components/Frontend/Categories";
import ForgotPassword from "./Components/Frontend/ForgotPassword";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/admin/add-recipe" element={<AddRecipe />} />
          <Route path="/home" element={<CookCraftHome />} />
          <Route path="/recipe-page" element={<RecipePage />} />
          <Route path="/category-page" element={<CategorytPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/login-page" element={<LoginPage/>} />
          <Route path="/Signup-page" element={<SignUpPage/>} />
          <Route path="/forgot-psw" element={<ForgotPassword/>} />
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

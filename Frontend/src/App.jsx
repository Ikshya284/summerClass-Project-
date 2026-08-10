import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./Components/auth/login";
import SignUpPage from "./Components/auth/Signup";
import ForgotPassword from "./Components/auth/ForgotPassword";
import ResetPassword from "./Components/auth/ResetPassword";

import LandingPage from "./Pages/LandingPage";
import CookCraftHome from "./Pages/Home";
import AdminDashboard from "./Pages/AdminDashboard";


import AddRecipe from "./Components/Recipes/AddRecipe";
import RecipeList from "./Components/Recipes/RecipeList";
import RecipePage from "./Components/Recipes/RecipePage";
import AdminAbout from "./Pages/AdminAbout";

import IngredientList from "./Ingredients/IngredientList";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import GuestRoute from "./routes/GuestRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Landing Page */}
        <Route 
          path="/" 
          element={<LandingPage />} 
        />


        {/* Guest-only Routes */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <SignUpPage />
            </GuestRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />


        {/* User Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <CookCraftHome />
            </ProtectedRoute>
          }
        />


        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipeList />
            </ProtectedRoute>
          }
        />


        <Route
          path="/recipes/:id"
          element={
            <ProtectedRoute>
              <RecipePage />
            </ProtectedRoute>
          }
        />


        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


        <Route
          path="/admin/add-recipe"
          element={
            <AdminRoute>
              <AddRecipe />
            </AdminRoute>
          }
        />


        <Route
          path="/admin/edit-recipe/:id"
          element={
            <AdminRoute>
              <AddRecipe />
            </AdminRoute>
          }
        />


        <Route
          path="/admin/recipes"
          element={
            <AdminRoute>
              <RecipeList />
            </AdminRoute>
          }
        />


        <Route
          path="/admin/ingredients"
          element={
            <AdminRoute>
              <IngredientList />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/about"
          element={
            <ProtectedRoute>
              <AdminAbout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/category-page"
          element={
            <AdminRoute>
              <div>
                Categories Page
              </div>
            </AdminRoute>
          }
        />


        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

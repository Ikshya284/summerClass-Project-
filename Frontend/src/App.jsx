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

import IngredientList from "./Ingredients/IngredientList";

import CategoryPage from "./Pages/CategoryPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import GuestRoute from "./routes/GuestRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public entry point */}
          <Route path="/" element={<LandingPage />} />

          {/* Guest-only: redirect an already-logged-in user to their role home */}
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

          {/* Authenticated user routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <CookCraftHome />
              </ProtectedRoute>
            }
          />

          {/* Authenticated admin-only routes */}
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
            path="/admin/category-page"
            element={
              <AdminRoute>
                <CategoryPage/>
              </AdminRoute>
            }
          />

          {/* Anything unknown falls back to the public Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
import Hero from "./pages/Hero";
import Navbar from "./components/Navbar";
import RecipeList from "./pages/RecipeList";

const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <RecipeList />
    </div>
  );
};

export default App;

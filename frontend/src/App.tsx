import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import RecipeList from "./components/RecipeList";

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

import SimulationView from "./components/SimulationView.jsx";
import { GameOfLife } from "./systems/GameOfLife.js";

export default function App() {
  return <SimulationView systemClass={GameOfLife} />;
}

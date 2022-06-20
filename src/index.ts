import "../css/index.css";
import "../css/plant.css";
import "../css/interface.css";
import Panel from "./control/panel";
import GAME from "../lib/game";

GAME.init();
GAME.start();

let panel = new Panel();
panel.start();
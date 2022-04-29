import "../css/index.css";
import "../css/plant.css";
import "../css/interface.css";
import GameInterface from "./control/gameInterface";
import GAME from "../lib/game";

GAME.init();
GAME.start();

let gameInterface = new GameInterface();
gameInterface.start();
import View from "../../lib/view/view";
import Panel from "../../lib/scene/panel";

export default class TestPanel extends Panel {

  public assets(): void {
    this.scene.addImgInfo(require("@/assets/SodRoll.png"));
  }
  public run(): void {
    let bg: View = new View(this.scene.getImgInfo(require("@/assets/SodRoll.png")),  0, 0, 500, 600)
    this.scene.addView(bg);
  }
}
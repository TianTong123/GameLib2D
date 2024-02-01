class Rect {
    constructor(x, y, width, height, angle) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.angle = angle;
    }
  
    intersects(other) {
      // 计算本矩形和另一个矩形的半宽度、半高度以及旋转角度的正弦和余弦值
      const hw1 = this.width / 2;
      const hh1 = this.height / 2;
      const hw2 = other.width / 2;
      const hh2 = other.height / 2;
      const sinA = Math.sin(this.angle);
      const cosA = Math.cos(this.angle);
      const sinB = Math.sin(other.angle);
      const cosB = Math.cos(other.angle);
  
      // 计算两个矩形的中心点之间的向量
      const dx = (this.x + hw1 - other.x - hw2) * cosB + (this.y + hh1 - other.y - hh2) * sinB;
      const dy = (this.x + hw1 - other.x - hw2) * -sinB + (this.y + hh1 - other.y - hh2) * cosB;
  
      // 计算两个矩形边界之间的距离
      const dxa = Math.abs(dx * cosA + dy * sinA);
      const dya = Math.abs(-dx * sinA + dy * cosA);
      const dw = hw1 + hw2;
      const dh = hh1 + hh2;
  
      // 判断两个矩形是否相交
      if (dxa <= dw && dya <= dh) {
        return true;
      } else {
        return false;
      }
    }
  }
  
  // 矩形类的使用示例
  const rect1 = new Rect(0, 0, 100, 50, 0);
  const rect2 = new Rect(70, 20, 50, 80, Math.PI / 6);
  
  console.log(rect1.intersects(rect2)); // true
  
  rect2.x += 100;
  console.log(rect1.intersects(rect2)); // false
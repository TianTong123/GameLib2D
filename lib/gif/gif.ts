import Stream from "./stream";

/**
 * gif类
 */
export default class Gif {
  private FRAME_LIST: Array<ImageData> = [];
  private TEMP_CANVAS: HTMLCanvasElement;
  private TEMP_CANVAS_CTX: CanvasRenderingContext2D | undefined;
  private GIF_INFO: any;
  private STREAM: Stream | undefined;
  private LAST_DISPOSA_METHOD: number | undefined;
  private CURRENT_FRAME_INDEX: number | undefined;
  private DELAY: number = 0;
  private TRANSPARENCY: any;

  constructor() {
    this.TEMP_CANVAS = document.createElement("canvas");
    this.GIF_INFO = {};
  }

  // 加载方法
  public load(url: string): Promise<Gif> {
    return new Promise((resolve, reject) => {
      const h: XMLHttpRequest = new XMLHttpRequest();
      h.open('GET', url, true);
      // 浏览器兼容处理
      if ('overrideMimeType' in h) {
        h.overrideMimeType('text/plain; charset=x-user-defined');
      }
      // old browsers (XMLHttpRequest-compliant)
      else if ('responseType' in h) {
        h.responseType = 'arraybuffer';
      }
      // IE9 (Microsoft.XMLHTTP-compliant)
      else {
        h.setRequestHeader('Accept-Charset', 'x-user-defined');
      }

      let that: Gif = this;
      h.onload = function (e) {
        if (this.status != 200) {
          return
        }
        // if (!('response' in this)) {
        //   this.response= new VBArray(this.responseText as any).toArray().map(String.fromCharCode as any).join('');
        // }
        let data = this.response;
        if (data.toString().indexOf("ArrayBuffer") > 0) {
            data = new Uint8Array(data);
        }
        that.STREAM = new Stream(data);
        that.parseHeader();
        that.parseBlock();
        resolve(that)
      };

      h.onerror = function (e) {
        console.log("摆烂 error", e)
        reject("摆烂")
      };

      h.send();
    })
  }

  // 转流数组
  private byteToBitArr(bite: any) {
    let byteArr = [];
    for (let i = 7; i >= 0; i--) {
      byteArr.push(!!(bite & (1 << i)));
    }
    return byteArr;
  };

  // Generic functions
  private bitsToNum(ba: any) {
    return ba.reduce(function (s: number, n: number) {
      return s * 2 + n;
    }, 0);
  };

  private lzwDecode(minCodeSize: any, data: any) {
    // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
    let pos = 0; // Maybe this streaming thing should be merged with the Stream?
    function readCode(size: number) {
      let code = 0;
      for (let i = 0; i < size; i++) {
        if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
          code |= 1 << i;
        }
        pos++;
      }
      return code;
    };

    let output: any = [],
      clearCode = 1 << minCodeSize,
      eoiCode: number = clearCode + 1,
      codeSize: number = minCodeSize + 1,
      dict: any = [];

    function clear() {
      dict = [];
      codeSize = minCodeSize + 1;
      for (let i = 0; i < clearCode; i++) {
        dict[i] = [i];
      }
      dict[clearCode] = [];
      dict[eoiCode] = null;

    };

    let code = 0, last = 0;
    while (true) {
      last = code;
      code = readCode(codeSize);

      if (code === clearCode) {
        clear();
        continue;
      }
      if (code === eoiCode) {
        break
      };
      if (code < dict.length) {
        if (last !== clearCode) {
          dict.push(dict[last].concat(dict[code][0]));
        }
      }
      else {
        if (code !== dict.length) {
          throw new Error('Invalid LZW code.');
        }
        dict.push(dict[last].concat(dict[last][0]));
      }
      output.push.apply(output, dict[code]);

      if (dict.length === (1 << codeSize) && codeSize < 12) {
        // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
        codeSize++;
      }
    }
    return output;
  };

  private readSubBlocks() {
    let size = null, data = '';
    do {
      size = (this.STREAM as Stream).readByte();
      data += (this.STREAM as Stream).read(size);
    } while (size !== 0);
    return data;
  };

  private doImg(img: any) {
    if (!this.TEMP_CANVAS_CTX) {
      // 没有就创建
      this.TEMP_CANVAS_CTX = this.TEMP_CANVAS.getContext('2d') as CanvasRenderingContext2D;
    }
    const currIdx = this.FRAME_LIST.length,
      ct = img.lctFlag ? img.lct : this.GIF_INFO.gct;
    if (currIdx > 0) {
      // 这块不要动
      if (this.LAST_DISPOSA_METHOD === 3) {
        // Restore to previous
        // If we disposed every this.TEMP_CANVAS_CTX including first this.TEMP_CANVAS_CTX up to this point, then we have
        // no composited this.TEMP_CANVAS_CTX to restore to. In this case, restore to background instead.
        if (this.CURRENT_FRAME_INDEX !== null) {
          this.TEMP_CANVAS_CTX.putImageData(this.FRAME_LIST[this.CURRENT_FRAME_INDEX as number], 0, 0);
        } else {
          this.TEMP_CANVAS_CTX.clearRect(0, 0, this.TEMP_CANVAS.width, this.TEMP_CANVAS.height);
        }
      } else {
        this.CURRENT_FRAME_INDEX = currIdx - 1;
      }

      if (this.LAST_DISPOSA_METHOD === 2) {
        // Restore to background color
        // Browser implementations historically restore to transparent; we do the same.
        // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
        this.TEMP_CANVAS_CTX.clearRect(0, 0, this.TEMP_CANVAS.width, this.TEMP_CANVAS.height);
      }
    }
    let imgData = this.TEMP_CANVAS_CTX.getImageData(img.leftPos, img.topPos, img.width, img.height);
    img.pixels.forEach((pixel: any, i: number) => {
      if (pixel !== this.TRANSPARENCY) {
        imgData.data[i * 4 + 0] = ct[pixel][0];
        imgData.data[i * 4 + 1] = ct[pixel][1];
        imgData.data[i * 4 + 2] = ct[pixel][2];
        imgData.data[i * 4 + 3] = 255; // Opaque.
      }
    });

    this.TEMP_CANVAS_CTX.putImageData(imgData, img.leftPos, img.topPos);
  };

  private pushFrame() {
    if (!this.TEMP_CANVAS_CTX) {
      return
    };
    this.FRAME_LIST.push(this.TEMP_CANVAS_CTX.getImageData(0, 0, this.GIF_INFO.width, this.GIF_INFO.height));
  };

  // 解析
  private parseExt(block: any) {

    let parseGCExt: Function = (block: any) => {
      (this.STREAM as Stream).readByte(); // Always 4 这个必须得这样执行一次
      var bits = this.byteToBitArr((this.STREAM as Stream).readByte());
      block.reserved = bits.splice(0, 3); // Reserved; should be 000.


      block.disposalMethod = this.bitsToNum(bits.splice(0, 3));
      this.LAST_DISPOSA_METHOD = block.disposalMethod

      block.userInput = bits.shift();
      block.transparencyGiven = bits.shift();
      block.delayTime = (this.STREAM as Stream).readUnsigned();
      block.transparencyIndex = (this.STREAM as Stream).readByte();
      block.terminator = (this.STREAM as Stream).readByte();
      this.DELAY = block.delayTime * 10;
      this.pushFrame();
      this.TRANSPARENCY = block.transparencyGiven ? block.transparencyIndex : null;
    };

    let parseComExt: Function = (block: any) => {
      block.comment = this.readSubBlocks();
    };

    let parsePTExt: Function = (block: any) => {
      // No one *ever* uses this. If you use it, deal with parsing it yourself.
      (this.STREAM as Stream).readByte(); // Always 12 这个必须得这样执行一次
      block.ptHeader = (this.STREAM as Stream).readBytes(12);
      block.ptData = this.readSubBlocks();
    };

    let parseAppExt: Function = (block: any) => {
      let parseNetscapeExt: Function = (block: any) => {
        (this.STREAM as Stream).readByte(); // Always 3 这个必须得这样执行一次
        block.unknown = (this.STREAM as Stream).readByte(); // ??? Always 1? What is this?
        block.iterations = (this.STREAM as Stream).readUnsigned();
        block.terminator = (this.STREAM as Stream).readByte();
      };

      let parseUnknownAppExt: Function = (block: any) => {
        block.appData = this.readSubBlocks();
        // FIXME: This won't work if a handler wants to match on any identifier.
        // handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
      };

      (this.STREAM as Stream).readByte(); // Always 11 这个必须得这样执行一次
      block.identifier = (this.STREAM as Stream).read(8);
      block.authCode = (this.STREAM as Stream).read(3);
      switch (block.identifier) {
        case 'NETSCAPE':
          parseNetscapeExt(block);
          break;
        default:
          parseUnknownAppExt(block);
          break;
      }
    };

    let parseUnknownExt: Function = (block: any) => {
      block.data = this.readSubBlocks();
    };

    block.label = (this.STREAM as Stream).readByte();
    switch (block.label) {
      case 0xF9:
        block.extType = 'gce';
        parseGCExt(block);
        break;
      case 0xFE:
        block.extType = 'com';
        parseComExt(block);
        break;
      case 0x01:
        block.extType = 'pte';
        parsePTExt(block);
        break;
      case 0xFF:
        block.extType = 'app';
        parseAppExt(block);
        break;
      default:
        block.extType = 'unknown';
        parseUnknownExt(block);
        break;
    }
  };

  private parseImg(img: any) {
    function deinterlace(pixels: any, width: any) {
      // Of course this defeats the purpose of interlacing. And it's *probably*
      // the least efficient way it's ever been implemented. But nevertheless...
      let newPixels: any = new Array(pixels.length);
      const rows = pixels.length / width;

      function cpRow(toRow: any, fromRow: any) {
        const fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
        newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
      };

      // See appendix E.
      const offsets = [0, 4, 2, 1],
        steps = [8, 8, 4, 2];

      let fromRow = 0;
      for (var pass = 0; pass < 4; pass++) {
        for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
          cpRow(toRow, fromRow)
          fromRow++;
        }
      }

      return newPixels;
    };

    img.leftPos = (this.STREAM as Stream).readUnsigned();
    img.topPos = (this.STREAM as Stream).readUnsigned();
    img.width = (this.STREAM as Stream).readUnsigned();
    img.height = (this.STREAM as Stream).readUnsigned();

    let bits = this.byteToBitArr((this.STREAM as Stream).readByte());
    img.lctFlag = bits.shift();
    img.interlaced = bits.shift();
    img.sorted = bits.shift();
    img.reserved = bits.splice(0, 2);
    img.lctSize = this.bitsToNum(bits.splice(0, 3));

    if (img.lctFlag) {
      img.lct = this.parseCT(1 << (img.lctSize + 1));
    }

    img.lzwMinCodeSize = (this.STREAM as Stream).readByte();

    const lzwData = this.readSubBlocks();

    img.pixels = this.lzwDecode(img.lzwMinCodeSize, lzwData);

    if (img.interlaced) { // Move
      img.pixels = deinterlace(img.pixels, img.width);
    }

    this.doImg(img);
  };

  // LZW (GIF-specific)
  private parseCT(entries: any) { // Each entry is 3 bytes, for RGB.
    let ct = [];
    for (let i = 0; i < entries; i++) {
      ct.push((this.STREAM as Stream).readBytes(3));
    }
    return ct;
  };

  private parseHeader() {
    this.GIF_INFO.sig = (this.STREAM as Stream).read(3);
    this.GIF_INFO.ver = (this.STREAM as Stream).read(3);
    if (this.GIF_INFO.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
    this.GIF_INFO.width = (this.STREAM as Stream).readUnsigned();
    this.GIF_INFO.height = (this.STREAM as Stream).readUnsigned();

    let bits = this.byteToBitArr((this.STREAM as Stream).readByte());
    this.GIF_INFO.gctFlag = bits.shift();
    this.GIF_INFO.colorRes = this.bitsToNum(bits.splice(0, 3));
    this.GIF_INFO.sorted = bits.shift();
    this.GIF_INFO.gctSize = this.bitsToNum(bits.splice(0, 3));

    this.GIF_INFO.bgColor = (this.STREAM as Stream).readByte();
    this.GIF_INFO.pixelAspectRatio = (this.STREAM as Stream).readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
    if (this.GIF_INFO.gctFlag) {
      this.GIF_INFO.gct = this.parseCT(1 << (this.GIF_INFO.gctSize + 1));
    }
    // 给 this.TEMP_CANVAS 设置大小
    this.TEMP_CANVAS.width = this.GIF_INFO.width;
    this.TEMP_CANVAS.height = this.GIF_INFO.height;
    this.TEMP_CANVAS.style.width = this.GIF_INFO.width + 'px';
    this.TEMP_CANVAS.style.height = this.GIF_INFO.height + 'px';
    (this.TEMP_CANVAS.getContext('2d') as CanvasRenderingContext2D).setTransform(1, 0, 0, 1, 0, 0);
  };

  private parseBlock() {
    let block: any = {};
    block.sentinel = (this.STREAM as Stream).readByte();
    switch (String.fromCharCode(block.sentinel)) { // For ease of matching
      case '!':
        block.type = 'ext';
        this.parseExt(block);
        break;
      case ',':
        block.type = 'img';
        this.parseImg(block);
        break;
      case ';':
        block.type = 'eof';
        // 已经结束啦。结束就跑这
        // this.playGif();
        break;
      default:
        throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
    }

    // 递归
    if (block.type !== 'eof') {
      this.parseBlock();
    }
  };

  // 返回所有帧
  public getFrames(): Array<ImageData> {
    return this.FRAME_LIST;
  }

  // 获取播放延时
  public getDelay(): number {
    return this.DELAY
  }

  // 获取 tempcanvas
  public getTempCanvas(): HTMLCanvasElement {
    return this.TEMP_CANVAS;
  }
}
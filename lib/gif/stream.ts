/**
 * anyScript 凎
 */
export default class Stream {
  private data: any;
  private length: number;
  private poisition: number;
  constructor(data: any) {
    this.data = data;
    this.length = data.length;
    this.poisition = 0;
  }

  readByte() {
    if (this.poisition >= this.length) {
      throw new Error('Attempted to read past end of stream.');
    }
    if (this.data instanceof Uint8Array)
      return this.data[this.poisition++];
    else
      return this.data.charCodeAt(this.poisition++) & 0xFF;
  };

  readBytes(n: number) {
    let bytes = [];
    for (let i = 0; i < n; i++) {
      bytes.push(this.readByte());
    }
    return bytes;
  };

  read(n: number) {
    let chars = '';
    for (let i = 0; i < n; i++) {
      chars += String.fromCharCode(this.readByte());
    }
    return chars;
  };

  readUnsigned() { // Little-endian.
    let unsigned = this.readBytes(2);
    return (unsigned[1] << 8) + unsigned[0];
  };
};
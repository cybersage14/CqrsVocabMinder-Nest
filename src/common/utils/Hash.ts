import * as bcrypt from 'bcrypt';

export class Hash {
  static make(plainText) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(plainText, salt);
  }

  static async compare(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
  }
}

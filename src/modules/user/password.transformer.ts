import { ValueTransformer } from 'typeorm';
import { Hash } from '../../common/utils/Hash';

export class PasswordTransformer implements ValueTransformer {
  to(value) {
    return Hash.make(value);
  }

  from(value) {
    return value;
  }
}

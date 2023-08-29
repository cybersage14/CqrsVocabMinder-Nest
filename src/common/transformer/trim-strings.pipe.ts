import { AbstractTransformPipe } from './abstract-transform.pipe';

export class TrimStringsPipe extends AbstractTransformPipe {

  protected transformValue(value: any) {
    return typeof value === 'string' ? value.trim() : value;
  }
}

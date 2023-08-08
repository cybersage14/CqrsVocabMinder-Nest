import { Global, Module } from '@nestjs/common';
import { IsUniqueConstraint, } from './validator/unique.validator';

@Global()
@Module({
  providers: [IsUniqueConstraint],
})
export class CommonModule {}

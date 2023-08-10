import {
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export default abstract class BaseModel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;
  
    @CreateDateColumn({
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP(6)',
      name: 'created_at',
    })
    public createdAt: Date;
  
    @UpdateDateColumn({
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
      name: 'updated_at',
    })
    public updatedAt: Date;
  }
  
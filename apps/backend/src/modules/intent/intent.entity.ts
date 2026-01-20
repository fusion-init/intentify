import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';

@Entity('intent_results')
export class IntentResult {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index({ unique: true })
    query_hash: string;

    @Column('text')
    query_text: string;

    @Column('jsonb')
    result: any;

    @Column({ default: 0 })
    cache_hits: number;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    @Index()
    expires_at: Date;
}

import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class AnalyzeQueryDto {
    @IsString()
    @MinLength(3)
    @MaxLength(500)
    query: string;

    @IsOptional()
    @IsBoolean()
    includeKeywords?: boolean;
}

export class BatchAnalyzeDto {
    @IsString({ each: true })
    queries: string[];
}

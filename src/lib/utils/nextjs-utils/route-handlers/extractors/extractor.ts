import { NextRequest } from 'next/server';

export type Extractor = (request: NextRequest) => Promise<unknown>;

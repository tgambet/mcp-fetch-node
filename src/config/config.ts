import { z } from 'zod';
import { parseArgs } from '../utils/parse-args.js';

export const argsSchema = z.object({
  'user-agent': z.string().optional(),
  'ignore-robots-txt': z.boolean().optional(),
  port: z.coerce.number().optional().default(8080),
});

export type Config = z.infer<typeof argsSchema>;

export const config = argsSchema.parse(parseArgs());

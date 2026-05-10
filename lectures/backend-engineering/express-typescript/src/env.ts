import { z } from "zod"; 

/**
 * Define the structure and validation rules for environment variables.
 * Using .optional() means the app won't crash if PORT is missing,
 * but if it's present, it must be a string.
 */
const envSchema = z.object({
    PORT: z.string().optional()
})

/**
 * Validates the provided environment object against the schema.
 * @param env - Typically process.env or a mock object for testing.
 * @returns The validated and typed data object.
 */
function createEnv(env: NodeJS.ProcessEnv) {
    // safeParse returns an object containing either the data or a detailed error
    const safeParseResult = envSchema.safeParse(env); 

    // If validation fails, throw a descriptive error immediately
    if (!safeParseResult.success) {
        throw new Error(`Invalid environment variables: ${safeParseResult.error.message}`); 
    }

    // Return the validated data (this also provides full TypeScript intellisense)
    return safeParseResult.data; 
}

// Export the validated 'env' object to be used throughout the application
export const env = createEnv(process.env);
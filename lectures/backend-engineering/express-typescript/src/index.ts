// Import the native Node.js HTTP module to create the server instance
import http from 'node:http'
// Import the validated environment variables from your local env.js file
import { env } from './env.js'
import { createServerApplication } from './app/index.js'

// Import types only (erased at runtime) for Express application integration
import type { Application } from 'express'

/**
 * Main bootstrap function to initialize and start the server.
 * Using an async function allows for 'await' if you add DB connections later.
 */
async function main() {
    try {
        // Initialize the HTTP server instance and delegate it to Express
        const server = http.createServer(createServerApplication())

        /**
         * Logic to determine the active port:
         * If env.PORT exists (from your Zod schema), convert it to a number.
         * Otherwise, default to port 8080.
         */
        const PORT: number = env.PORT ? +env.PORT : 8080

        // Start the server and begin listening for incoming requests
        server.listen(PORT, () => {
            // Callback executed once the server is successfully bound to the port
            console.log(`Server is running on PORT ${PORT}`)
        })
        
    } catch(error) {
        // Re-throw the error to be handled by a global process listener or to crash the process
        throw error
    }
}

// Execute the bootstrap sequence
main()
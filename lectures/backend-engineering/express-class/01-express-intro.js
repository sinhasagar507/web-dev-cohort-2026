const express = require('express')

function block_1_basicServer() {
    return new Promise((resolve) => {
        const app = express()
        
        // Middleware to parse incoming JSON requests
        app.use(express.json())

        /**
         * 1. Static Route
         * Returns a fixed list of menu items.
         */
        // In web development, everything operates in a request-response cycle
        app.get('/menu', (_, res) => {
            res.json({
                items: ['thali', 'biryani'] 
            })
        })

        /**
         * 2. Query Parameters
         * Example: chaicode.com/search?q=biryani&limit=5
         * 'q' and 'limit' are extracted from the URL after the '?'
         */
        app.get('/search', (req, res) => {
            const { q, limit } = req.query
            res.json({
                query: q, 
                // Provides a default value of 10 if limit is not provided
                limit: limit || 10
            })
        })

        /**
         * 3. Path/URL Parameters
         * Example: chaicode.com/menu/123
         * ':id' is a placeholder for whatever value is passed in that spot
         */
        app.get('/menu/:id', (req, res) => {
            const { id } = req.params
            res.json({
                item: id, 
                price: 149
            })
        })
        
        // Note: In a real scenario, you'd need app.listen() 
        // and resolve() to actually "finish" this Promise.

        // Post mein zyada data nai aata, bss 2-3 tarikon se aata hai
        app.post('/order', (req, res) => {
            const order = req.body
            res.status(201).json({ // .json() serialize krke data bhejega
                status: 'created', 
                order
            })

        })

        // Start server on port 0 (OS picks any available random port)
        const server = app.listen(0, async () => {
            // Retrieve the actual port number assigned by the Operating System
            const port = server.address().port 
            // Format the local address string (useful for making test requests)
            const base = `http://127.0.0.1:${port}`; 

            try {
                // Placeholder for async operations (like running a test suite)
                const menuRes = await fetch(`${base}/menu`)
                const menuData = menuRes.json()
                console.log('GET /menu', JSON.stringify(menuData))

                console.log("+++++++++++++++++++++++++++++++++++++++")

                // abb likhne ko yahan pe main further params likh skta hui but unkko mere endPoints consume nai krr rhe hain
                const searchRes = await fetch(`{base}/search/q=biryani&limit=5`)
                const searchData = searchRes.json()
                console.log('GET /search', JSON.stringify(searchData))

                // Usually this is a GET request, but anyhow kya krein
                const menuItemRes = await fetch(`${base}/menu/42`)
                const menuItemData = await menuItemRes.json()
                console.log(`POST /menu`, JSON.stringify(menuItemData))
               
                console.log("+++++++++++++++++++++++++++++++++++++++")


                // Always look at requests from the Client Perspective 
                const orderRes = await fetch(`${base}/order`, {
                    method: 'POST', 
                    headers: {
                       'Content-Type': 'application/json', 
                       body: JSON.stringify({
                        dish: 'biryani', 
                        quantity: 2
                       })
                    }
                })


            } catch (error) {
                // Handle any errors that occur during the async execution

            }

            server.close(() => {
                console.log("Block 1 served...")
                resolve()
            })
        })
    
    })
}

function block_2_response(){
    return new Promise((resolve) => {
        const app = express()

        app.get('/text', (req, res) => {
            res.send('Hello from Chaicode'); 
        })

        app.get('/json', (req, res) => {
            res.json({
                framework: 'express', 
                version: '6.1.1'
            })
        })

        app.get('/not-found', (req, res) => {
            res.status(404).json({
                error: "Page Not Found"
            })
        })

        // Health Status
        app.get('/health', (req, res) => {
            // Body toh hai idhr bhi
            res.sendStatus(200)
        })

        // Redirects krne hain
        app.get('/old-menu', (req, res) => {
            // add entry in DB to see how many users are still visiting old route
            res.redirect(301, '/new-menu')
        })

        // XML Data 
        app.get('/xml', (req, res) => {
            res.type('application/xml').send('<dish><name>Biryani</name></name></dish>')
        })

        // LeetCode mein premium ka fast execution AND normal vaalon ka slow execution
        app.get('/custom-headers', (req, res) => {
            res.set('X-powered-By', 'Chaicode'); 
            res.set('X-Request-Id', '12345'); 
            res.json(
                {
                   message: 'Custom Headers Sent' 
                }
            )
        })
        
        const server = app.listen(0, async() => {
            const port = server.address().port
            const base = 'http://127.0.0.1:${port}'; 
            try {
                // TODO:

            } catch (error) {
                console.log(error); 
            }
        })
    })
}

async function main() {
    await block_1_basicServer()
    await block_2_basicServer()
    
    process.exit(0)
}

main()
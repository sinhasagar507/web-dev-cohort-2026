
const express = require('express')

// GPT code for understanding
const express = require('express');

/**
 * BOOTCAMP CHALLENGE: The "All-in-One" Server & Client
 * This function creates a server, defines REST routes, starts listening, 
 * and then immediately acts as a client to test itself.
 */
function block_1_httpMethods() {
    return new Promise((resolve) => {
        const app = express();

        // MIDDLEWARE: This is the "Translator." 
        // It converts incoming JSON strings into JavaScript objects (req.body).
        app.use(express.json());

        // IN-MEMORY DATABASE: A simple object to store our train routes.
        const routes = {
            1: { id: 1, name: "Dadar Andheri Express", direction: "North" },
            2: { id: 2, name: "Bandra-Kurla Shuttle", direction: "East" }
        };

        let nextid = 3;

        // --- SERVER SIDE: ROUTE DEFINITIONS ---

        // GET: List all trains. 
        // We use Object.values() because the client usually wants an Array, not an Object.
        app.get("/routes", (req, res) => {
            console.log("Server: Received GET request for all routes");
            res.json(Object.values(routes)); 
        });

        // GET: Single route by ID.
        // :id is a "URL Parameter." Express grabs it and puts it in req.params.
        app.get('/routes/:id', (req, res) => {
            const route = routes[req.params.id];
            if (!route) {
                return res.status(404).json({ error: "No train found with this ID" });
            }
            res.json(route);
        });

        // POST: Create a new resource.
        app.post('/routes', (req, res) => {
            console.log("Server: Received POST request with data:", req.body);
            const newRoute = { id: nextid++, ...req.body };
            routes[newRoute.id] = newRoute;
            res.status(201).json(newRoute); // 201 = "Created"
        });

        // PUT: Replace the entire resource.
        app.put("/routes/:id", (req, res) => {
            const id = req.params.id;
            if (!routes[id]) return res.status(404).json({ error: "Cannot update non-existent route" });
            
            // We overwrite the whole entry, but keep the ID consistent.
            routes[id] = { id: Number(id), ...req.body };
            res.json(routes[id]);
        });

        // PATCH: Partial update. Only change what the client sends.
        app.patch("/routes/:id", (req, res) => {
            const id = req.params.id;
            if (!routes[id]) return res.status(404).json({ error: "Cannot patch non-existent route" });

            // FIX: We grab the updates from the request body.
            const updates = req.body; 
            
            // Merge existing data with new updates using the Spread operator.
            routes[id] = { ...routes[id], ...updates }; 

            res.status(200).json({
                message: "Route updated successfully!",
                data: routes[id]
            });
        });

        // DELETE: Remove the resource.
        app.delete("/routes/:id", (req, res) => {
            const id = req.params.id;
            if (!routes[id]) return res.status(404).json({ error: "Nothing to delete" });
            
            delete routes[id];
            res.status(204).end(); // 204 = "No Content" (Success, but nothing to send back)
        });

        // --- THE EXECUTION: START SERVER & TEST ---

        // listen(0) tells the OS: "Give me any random available port."
        const server = app.listen(0, async () => {
            const port = server.address().port;
            const base = `http://127.0.0.1:${port}`;
            console.log(`Server is live at: ${base}`);

            try {
                // CLIENT IMPERSONATOR: Testing the GET all routes
                const listRes = await fetch(`${base}/routes`);
                const listData = await listRes.json();
                console.log("Client: Received list of trains:", listData);

                // CLIENT IMPERSONATOR: Testing the POST route
                // FIX: 'body' must be OUTSIDE the 'headers' object.
                const createRes = await fetch(`${base}/routes`, {
                    method: "POST",
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify({
                        name: "Colaba-Worli",
                        direction: "South"
                    })
                });
                
                const created = await createRes.json();
                console.log("Client: Successfully created new train:", created);

            } catch (error) {
                console.error("Client Error:", error);
            }

            // Clean up: Close the server once our tests are done.
            server.close(() => {
                console.log("Server closed. Block 1 testing complete.");
                resolve();
            });
        });
    });
}

// Start the whole process
block_1_httpMethods();

function block_1_httpMethods(){
    return new Promise((resolve) => {
        const app = express()
        app.use(express.json())

        const routes = {
            1: {
                id: 1,
                name: "Dadar Andhri Express",
                direction: "North"
            },
            2: {
                id: 2,
                name: "Bandra-Kurla Shuttle",
                direction: "East"
            }
        }

        let nextid = 3

        // list all train
        app.get("/routes", (req, res) => {
            res.json(Object.values(routes)) // there is no need of sending the keys, sirf name chahiye toh kya krunga? values nikal lunga naa 
        })

        // single route by id
        // GET just receives resources 
        app.get('/routes/:id', (req, res) => {
            // const {id} = req.params
            // const route = routes[id]

            const route = routes[req.params.id]
            if(!route) return res.status(404).json({error: "No train on this id"});
            res.json(route)

        })

        // POST creates a new resource
        app.post('/routes', (req, res) => {
            //no validation, no zod
            const newRoute = {id: nextid++, ...req.body}
            routes[newRoute.id] = newRoute;
            res.status(201).json(newRoute)
        })

        // PUT replaces the entire resource
        app.put("/routes/:id", (req, res) => {
            const id = req.params.id
            if(!routes[id]) return res.status(404).json({error: "Something went wrong nhi bhejna h"});
            routes[id] = {id: Number(id), ...req.body}

        })

        // Useful when you want to update only a few fields without updating tne entire resource in PATCH
        app.patch("/routes/:id", (req, res) => {
            const id = req.params.id
            if(!routes[id]) return res.status(404).json({error: "Something went wrong nhi bhejna h"});
            //TODO complete this route
            // Perform the partial update in the routes with this new update
            routes[id] = {...routes[id], ...updates }; 


            // Send back the updated resource 
            res.status(200).json({
                message: "Route updated successfully! Chill maaro.",
                data: routes[id]
            })
        })

        app.delete("/routes/:id", (req, res) => {
            const id = req.params.id
            if(!routes[id]) return res.status(404).json({error: "Something went wrong nhi bhejna h"});
            delete routes[id]
            res.status(204).end()

        })



        const server = app.listen(0, async () => {
            const port = server.address().port
            const base = `http://127.0.0.1:${port}`;

            try {
                //TODO
                const listRes = await fetch(`${base}/routes`)
                const listData = await listRes.json()

                const createRes = await fetch(`${base}/routes`, {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json",
                        body: JSON.stringify({
                            name: "Colaba-Worli",
                            direction: "South"
                        })
                    }
                })
                const created = await createRes.json()

                
            } catch (error) {
                console.log(error)
            }

            server.close(() => {
                console.log("Block 1 served....")
                resolve()
            })


        })


    })
}


function block_1_httpMethods(){
    return new Promise((resolve) => {
        const app = express()
        app.use(express.json())
// /files/docs/readme.txt
// /files/assets/style.css
        app.get('/files/*filepath', (req, res) => {
            const filepath = req.params.filepath
            res.json({filepath, type: "wildcard"})
        })

        app
            .route("/schedule")
            .get((req, res) => {})
            .post((req, res) => {})
            .put((req, res) => {})
            .delete((req, res) => {})

        app.use("/api", (req, res) => {
            //its a prefetch match
            //Koi bhi route /api se start hota hai toh uske paas jaayega...agr /schedule hai toh nai jaayega
        })



        const server = app.listen(0, async () => {
            const port = server.address().port
            const base = `http://127.0.0.1:${port}`;

            try {
                //TODO
                

                
            } catch (error) {
                console.log(error)
            }

            server.close(() => {
                console.log("Block 1 served....")
                resolve()
            })


        })


    })
}

async function main(){
    await block_1_httpMethods()
    process.exit(0)
}

main()
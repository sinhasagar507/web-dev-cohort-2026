const express = require('express')


function block_1_httpMethods(){
    return new Promise((resolve) => {
        const app = express()

        const logs = []

        // Yhin pe payload ka maximum vo bhi decide krr skte hain
        app.use(express.json({ limit: '50kb' }))
        // agr nested keys use krein toh hi extended: true lgana
        app.use(express.urlencoded({extended: true}))
        app.use(express.static(root, {
            dotfiles: 'ignore', 
            maxAge: 0
        }))
        
        // request logger
        // khud ka Winston 'request logger' bna lete hai. Koi bhi aayega yahan pe toh 
        // entry krke jaaega

        app.use((req, res, next) => {
            // add to database 
            // console log everything
            // write in some file
            // date time hai vo bhi add krdenge

            const logEntry = `${req.method} : ${req.url}`
            logs.push(logEntry)
            console.log(`[LOG] -- ${logEntry}`)
            next()
        })

        app.use((req, res, next) => {
            req.startTime = Date.now()

            res.on('finish', () => {
                const duration = Date.now() - req.startTime;
                console.log(`[TIMER] - ${req.method} - ${req.url} took ${duration}ms`)
            })
            

            next()
        })

        function authMe (req, res, next) {
            const token = req.headers['x-auth-token']

            if(!token) {
                return res.status(401).json({error: "No Token, please login!"})
            }

            if (token !== "secret-chaicode"){
                return res.status(403).json({error: "Invalid token"})
            }

            // token -> extract data from token -> userID, email, admin
            req.user = {id: 1, name: "Hitesh", role: "admin"}

            next()
        
        }

        function getRole(role) {
            return (req, res, next) => {
                if (!req.user || req.user.role !== role) {
                    return res.status(403).json({error: `Role ${role} required`})
                }
            }
        }

        function getRole(roles) {
        return (req, res, next) => {
                // 1. Ensure roles is always an array (even if a single string is passed)
                const allowedRoles = Array.isArray(roles) ? roles : [roles];

                // 2. Check if user exists and if their role is in the allowed list
                if (!req.user || !allowedRoles.includes(req.user.role)) {
                    return res.status(403).json({ 
                        error: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}` 
                    });
                }

                // 3. IMPORTANT: Don't forget to call next() to move to the controller!
                // remember to add next(). Otherwise the request will hang permanently
                next()
            };
        }

        function rateLimit(maxRequest) {
            let count = 0

            return (req, res, next) => {
                count++ 

                if (count > maxRequest) {
                    return res.status(429).json({error: "Too many request"})
                }
            }
        }

        const limitedEndPoint = rateLimit(3)

        // Bss aise hi daalne ko daal diye...express ka yhi kaam hai jitne aaye sbb daalte jaao AND uss route ko hit krte hi it will request for the particular resource 
        app.get('/profile', authMe, getRole('admin'), () => {})
        app.get('/profile', authMe, getRole('teacher'), () => {})
        app.get('/profile', authMe, getRole('student'), () => {})
        app.get('/profile', authMe, getRole(['admin', 'teacher', 'student']), () => {})

        app.get('/limited', limitedEndPoint, (req, res) => {})


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
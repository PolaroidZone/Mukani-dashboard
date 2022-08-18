const express = require('express')
const app = express()
const port = '3080'

//set view engine
app.set('view engine', 'ejs')

//set static files
app.use(express.static('public'))

//set routes
const postsRouter = require('./routes/blog.js')
const projectsRouter = require('./routes/projects.js')

app.get('/',  (req, res) => {
    res.render('index.ejs')
})

//routes
app.use('/blog',postsRouter )
app.use('/projects', projectsRouter) 

app.listen(port, () => console.log(`Mukani dashboard app listening on port http://localhost:${port}`))
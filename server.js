const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')
const app = express()
const port = '3080'

mongoose.connect('mongodb://localhost/mukani')

//set view engine
app.set('view engine', 'ejs')

//set static files
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true}))
//methodOverride
app.use(methodOverride('_method'))

//set routes
const postsRouter = require('./routes/blog')
const projectsRouter = require('./routes/projects')

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('index.ejs', { articles: articles})
})

//routes
app.use('/blog',postsRouter )
app.use('/projects', projectsRouter) 

app.listen(port, () => console.log(`Mukani dashboard app listening on port http://localhost:${port}`))
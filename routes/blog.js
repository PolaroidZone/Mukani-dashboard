const express = require('express')
const Article = require('./../models/article.js')
const router = express.Router()


//express.use(urlencoded, ({extended: false}))
//main rout...
router.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('blog/blog.ejs', {articles: articles})
})

//create new article view
router.get('/new', (req, res) => {
    res.render('blog/new.ejs', { article: Article()})
})

//view selected article by id
router.get('/:slug', async (req, res) => {
const article = await Article.findOne({slug: req.params.slug})
    if (article == null) res.redirect('/')
    res.render('blog/view.ejs', {article: article})
})

//Delete article
router.delete('/:id', async(req, res, next) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/blog')
})  
// Edit article route

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('blog/edit.ejs', {article: article})
})

//save edit article

router.put('/:id', async(req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))

//post new article to database

router.post('/', async(req, res, next) => {
    req.article = new Article()
    next()
}, saveAndRedirect('new'))  

function saveAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
            article.imageString = req.body.imageString
        try {
            article = await article.save()
            res.redirect(`/blog/${article.slug}`)
        } catch (e) {
            console.log(e)
            res.render(`blog/${path}`, { article: article })
        } 
    }
}


module.exports = router
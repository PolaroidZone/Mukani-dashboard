const express = require('express')
const Project = require('./../models/project.js')
const router = express.Router()

//express.use(urlencoded, ({extended: false}))
//main rout...
router.get('/', async (req, res) => {
    const projects = await Project.find().sort({createdAt: 'desc'})
    res.render('projects/projects.ejs', {projects: projects})
})

//create new project view
router.get('/new', (req, res) => {
    res.render('projects/new.ejs', { project: Project()})
})

//view selected project by id
router.get('/:slug', async (req, res) => {
const project = await Project.findOne({slug: req.params.slug})
    if (project == null) res.redirect('/')
    res.render('projects/view.ejs', {project: project})
})

//Delete project
router.delete('/:id', async(req, res, next) => {
    await Project.findByIdAndDelete(req.params.id)
    res.redirect('/projects')
})  
// Edit project route

router.get('/edit/:id', async (req, res) => {
    const project = await Project.findById(req.params.id)
    res.render('projects/edit.ejs', {project: project})
})

//save edit project

router.put('/:id', async(req, res, next) => {
    req.project = await Project.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))

//post new projecct to database

router.post('/', async(req, res, next) => {   
    req.project = new Project()
    next()
}, saveAndRedirect('new'))  

function saveAndRedirect(path) {
    return async (req, res) => {
        let project = req.project
        project.name = req.body.name
        project.description = req.body.description
        project.markdown = req.body.markdown
        project.imageString = req.body.imageString
        try {
            project = await project.save()
            res.redirect(`/projects/${project.slug}`)
        } catch (e) {
            console.log(e)
            res.render(`projects/${path}`, { project: project })
        } 
    }
} 
 

module.exports = router
const mongoose = require('mongoose')
const { marked } = require('marked')
const slugify = require('slugify')
const createDomPurifire = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurifire(new JSDOM().window)

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    imageString: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        requierd: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

projectSchema.pre('validate', function(next){
    
    if (this.name) {
        this.slug = slugify(this.name, { lower: 'ture', strict: 'true'})
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next()
})


module.exports = mongoose.model('Project', projectSchema)
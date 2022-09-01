const mongoose = require('mongoose') 
const { marked } = require('marked')
const slugify = require('slugify')
const createDomPurifire = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurifire(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title:{
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

articleSchema.pre('validate', function(next){
    
    if (this.title) {
        this.slug = slugify(this.title, { lower: 'ture', strict: 'true'})
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next()
})


module.exports = mongoose.model('Article', articleSchema)
require('dotenv').config();
require('ejs');
const express = require('express')
const path = require('path')
const app = express()
const port = 8080;
const butter = require('buttercms')(process.env.BUTTER_CMS_TOKEN);

const assetsPath = path.join(__dirname, './assets');
const viewsPath = path.join(__dirname, "./views")

app.use(express.static(assetsPath));

// template engine setting
app.set('view engine', 'ejs');
app.set("views", viewsPath);

app.get('/', (_, res) => {
    butter.post.list({page_size:2,page: 1}).then(({data}) => {
        res.render('index', {
            posts: data.data,
        })
    });
})

app.get('/blog/:slug', (req,res) => {
    const slug = req.params.slug;
    butter.post.retrieve(slug).then(data => {
         res.render('blog-post', {
            post: data.data.data
        });
    }) 
})

app.listen(port)
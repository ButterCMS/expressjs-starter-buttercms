require('dotenv').config();
require('ejs');
const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const butter = !process.env.EXPRESS_APP_BUTTER_CMS_API_TOKEN ?  null : require('buttercms')(process.env.EXPRESS_APP_BUTTER_CMS_API_TOKEN, !process.env.EXPRESS_APP_BUTTER_CMS_PREVIEW);

const assetsPath = path.join(__dirname, './assets');
const viewsPath = path.join(__dirname, "./views");

app.use(express.static(assetsPath));

// template engine setting
app.set('view engine', 'ejs');
app.set("views", viewsPath);

app.get('/', (_, res) => {
    if(!butter){
        res.render('index', {
            type: "landing_page",
            API:false
        });
    } 
    butter.post.list({page_size:2,page: 1}).then(({data: posts}) => {
        butter.page.retrieve("landing-page", "landing-page-with-components").then(({data:landing_page_data}) => {
                res.render('index', {
                posts: posts.data,
                landing_page: landing_page_data.data,
                type: "landing-page",
                API: true
            });
        });
    }).catch(error => error.response.data.detail === 'Invalid token.' && res.render('404'));
   
});

app.get('/blog', (_,res) => {
    if(!butter){
        res.render('blog', {
            type: "blog",
            API:false
        });
    } 
    butter.post.list({page_size: 10, page: 1}).then(({data}) => {
        res.render('blog', {
            posts: data.data,
            type: 'blog',
            API: true
        });
    }).catch(error => error.response.data.detail === 'Invalid token.' && res.render('404'));;
});

app.get('/blog/search', (req,res) => {
    if(!butter){
        res.render('search', {
            type: "search",
            API:false
        });
    } 
    const query = req.query;

    butter.post.search(query.q).then(({data}) => {
        res.render('blog', {
            posts: data.data,
            type: 'search',
            query: query.q,
            API: true
        });
    }).catch(error => error.response.data.detail === 'Invalid token.' && res.render('404'));;
});

app.get('/blog/:slug', (req,res) => {
    if(!butter){
        res.render('blog-post', {
            type: "blog-post",
            API:false,
        });
    } 
    const slug = req.params.slug;

    butter.post.retrieve(slug).then(({data}) => {
         res.render('blog-post', {
            post: data.data,
            API: true,
            seo_title: data.data.seo_title,
            meta_description: data.data.meta_description,
            type: "blog-post"
        });
    }).catch(error => error.response.data.detail === 'Invalid token.' && res.render('404'));;
});

app.get('/blog/category/:slug', (req,res) => {
    if(!butter){
        res.render('blog', {
            type: "blog",
            API:false
        });
    } 
    
    const slug = req.params.slug;

    butter.category.retrieve(slug, {include: 'recent_posts'})
    .then(function({data}) {
        res.render('blog', {
            posts: data.data.recent_posts,
            slug: data.data.slug,
            name: data.data.name,
            type: 'category',
            API: true
        });
    }).catch(error => error.response.data.detail === 'Invalid token.' && res.render('404'));;
});


app.get('/blog/tag/:slug', (req,res) => {
    if(!butter){
        res.render('blog', {
            type: "blog",
            API:false
        });
    }
    const slug = req.params.slug;

    butter.tag.retrieve(slug, {include: "recent_posts"})
     .then(({data}) => {
        res.render('blog', {
            posts: data.data.recent_posts,
            slug: data.data.slug,
            name: data.data.name,
            type: 'tag'
        });
     }).catch(error => error.response.data.detail === 'Invalid token.' && res.render('404'));;
});

app.listen(port)
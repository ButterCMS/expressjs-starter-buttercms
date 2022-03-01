require('dotenv').config();
require('ejs');
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const preview = !process.env.EXPRESS_BUTTER_CMS_PREVIEW;

const butter = !process.env.EXPRESS_BUTTER_CMS_API_KEY
  ? null
  : require('buttercms')(process.env.EXPRESS_BUTTER_CMS_API_KEY, preview);

const assetsPath = path.join(__dirname, './assets');
const viewsPath = path.join(__dirname, './views');

const PORT = process.env.PORT || 8080;

// template engine setting
app.use(expressLayouts);
app.set('layout', './layout');
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use(express.static(assetsPath));

app.use(async (req, _, next) => {
  const menuItems = await butter.content.retrieve(['navigation_menu']);
  if (req.path === '/') {
    req.menuItems = menuItems.data.data.navigation_menu[0].menu_items;
    next();
    return;
  }

  const categories = await butter.category.list();
  req.categories = categories;
  req.menuItems = menuItems.data.data.navigation_menu[0].menu_items;
  next();
});

app.get('/', async (req, res) => {
  if (!butter) {
    res.render('index', {
      type: 'landing_page',
      API: false,
    });
  }

  try {
    const postsResponse = await butter.post.list({ page_size: 2, page: 1 });
    const postsData = postsResponse.data;

    const landingPageReponse = await butter.page.retrieve(
      'landing-page',
      'landing-page-with-components'
    );

    const landingPageData = landingPageReponse.data;
    const menuItems = req.menuItems;
    const landingPageSection = landingPageReponse.data.data.fields.body;

    res.render('index', {
      layout: './layout.ejs',
      posts: postsData.data,
      landing_page: landingPageData.data,
      type: 'landing-page',
      API: true,
      menuItems,
      fields: landingPageSection,
    });
  } catch (error) {
    error.response.data.detail === 'Invalid token.' && res.render('404');
  }
});

app.get('/blog', async (req, res) => {
  if (!butter) {
    res.render('blog', {
      layout: './layout.ejs',
      type: 'blog',
      API: false,
    });
  }

  const categories = req.categories.data.data;
  const menuItems = req.menuItems;

  try {
    const postResponse = await butter.post.list({ page_size: 10, page: 1 });
    const postData = postResponse.data;
    res.render('blog', {
      layout: './layout.ejs',
      menuItems,
      posts: postData.data,
      type: 'blog',
      API: true,
      categories,
    });
  } catch (error) {
    error.response.data.detail === 'Invalid token.' && res.render('404');
  }
});

app.get('/blog/search', async (req, res) => {
  if (!butter) {
    res.render('search', {
      type: 'search',
      API: false,
    });
  }
  const categories = req.categories.data.data;
  const query = req.query;
  const menuItems = req.menuItems;
  try {
    const blogSearchResponse = await butter.post.search(query.q);
    const blogSearchData = blogSearchResponse.data;
    res.render('blog', {
      layout: './layout.ejs',
      posts: blogSearchData.data,
      type: 'search',
      query: query.q,
      API: true,
      categories,
      menuItems,
    });
  } catch (error) {
    error.response.data.detail === 'Invalid token.' && res.render('404');
  }
});

app.get('/blog/:slug', async (req, res) => {
  if (!butter) {
    res.render('blog-post', {
      type: 'blog-post',
      API: false,
    });
  }
  const categories = req.categories.data.data;
  const slug = req.params.slug;
  const menuItems = req.menuItems;

  try {
    const blogResponse = await butter.post.retrieve(slug);
    const blogData = blogResponse.data;

    res.render('blog-post', {
      layout: './layout.ejs',
      post: blogData.data,
      API: true,
      seo_title: blogData.data.seo_title,
      meta_description: blogData.data.meta_description,
      type: 'blog-post',
      categories,
      menuItems,
    });
  } catch (error) {
    error.response.data.detail === 'Invalid token.' && res.render('404');
  }
});

app.get('/blog/category/:slug', async (req, res) => {
  if (!butter) {
    res.render('blog', {
      type: 'blog',
      API: false,
    });
  }

  const categories = req.categories.data.data;
  const slug = req.params.slug;
  const menuItems = req.menuItems;

  try {
    const blogResponse = await butter.category.retrieve(slug, {
      include: 'recent_posts',
    });
    const blogData = blogResponse.data;

    res.render('blog', {
      layout: './layout.ejs',
      posts: blogData.data.recent_posts,
      slug: blogData.data.slug,
      name: blogData.data.name,
      type: 'category',
      API: true,
      categories,
      menuItems,
    });
  } catch (error) {
    error.response.data.detail === 'Invalid token.' && res.render('404');
  }
});

app.get('/blog/tag/:slug', async (req, res) => {
  if (!butter) {
    res.render('blog', {
      type: 'blog',
      API: false,
    });
  }
  const categories = req.categories.data.data;
  const slug = req.params.slug;
  const menuItems = req.menuItems;

  try {
    const blogResponse = await butter.tag.retrieve(slug, {
      include: 'recent_posts',
    });
    const blogData = blogResponse.data;

    res.render('blog', {
      layout: './layout.ejs',
      posts: blogData.data.recent_posts,
      slug: blogData.data.slug,
      name: blogData.data.name,
      type: 'tag',
      API: true,
      categories,
      menuItems,
    });
  } catch (error) {
    error.response.data.detail === 'Invalid token.' && res.render('404');
  }
});

app.get('/:slug', async (req, res) => {
  if (!butter) {
    res.render('index', {
      type: 'landing_page',
      API: false,
    });
  }

  try {
    const postsResponse = await butter.post.list({ page_size: 2, page: 1 });
    const postsData = postsResponse.data;

    const landingPageReponse = await butter.page.retrieve(
      'landing-page',
      'landing-page-with-components'
    );

    const landingPageData = landingPageReponse.data;
    const menuItems = req.menuItems;
    const landingPageSection = landingPageReponse.data.data.fields.body;

    res.render('index', {
      layout: './layout.ejs',
      posts: postsData.data,
      landing_page: landingPageData.data,
      type: 'landing-page',
      API: true,
      menuItems,
      fields: landingPageSection,
    });
  } catch (error) {
    error.response.data.detail === 'Invalid token.' && res.render('404');
  }
});

app.listen(PORT);

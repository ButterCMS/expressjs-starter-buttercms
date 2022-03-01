import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import Butter from 'buttercms';

dotenv.config();

// const __dirname = path.resolve();
const app = express();
const preview = process.env.EXPRESS_BUTTER_CMS_PREVIEW === 'true' ? 1 : 0;

const butter = !process.env.EXPRESS_BUTTER_CMS_API_KEY
  ? null
  : Butter(process.env.EXPRESS_BUTTER_CMS_API_KEY, preview);

const assetsPath = path.join(path.resolve(), './assets');
const viewsPath = path.join(path.resolve(), './views');

const PORT = process.env.PORT || 8080;

// template engine setting
app.use(expressLayouts);
app.set('layout', './layout');
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use(express.static(assetsPath));

// fetch navigation menu for header and footer on every page
app.use(async (req, res, next) => {
  if (!butter) {
    next();
    return;
  }
  try {
    const menuItems = await butter.content.retrieve(['navigation_menu']);
    req.menuItems = menuItems.data.data.navigation_menu[0].menu_items;
    next();
  } catch (error) {
    error.response.data.detail === 'Invalid token.' &&
      res.render('404', { layout: false });
  }
});

// fetch categories list for all pages except landing page
app.use(async (req, res, next) => {
  if (!butter || req.path === '/') {
    next();
    return;
  }
  try {
    const categories = await butter.category.list();
    req.categories = categories;
    next();
  } catch (error) {
    error.response.data.detail === 'Invalid token.' &&
      res.render('404', { layout: false });
  }
});

app.get('/', async (req, res) => {
  if (!butter) {
    res.render('no-api-hero', {
      type: 'landing_page',
      API: false,
    });
    return;
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
    return;
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

export const renderLandingPage = async (req, res, butter, typeOfPage) => {
  if (!butter) {
    res.render('no-api-hero', {
      type: 'landing_page',
      API: false,
    });
    return;
  }

  const landingPageUrl = req.url.includes('landing-page') ? req.params.slug : 'landing-page-with-components';

  try {
    const postsResponse = await butter.post.list({ page_size: 2, page: 1 });
    const postsData = postsResponse.data;

    const landingPageReponse = await butter.page.retrieve(
      'landing-page',
      landingPageUrl
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
    error.response && res.render('404', { layout: false, type: '404' });
  }
};

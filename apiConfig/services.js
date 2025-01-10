import { automationQuery, automationQueryBySlug } from "./queries";

const { graphQlRequest, getRequest, postRequest, graphQlRequestFetch } = require("./requests");


export const getLanguagesApi = () => {
  const query = `{
      languages {
        country_flag_url
        native_name
        language_code
    }
  }`
  return graphQlRequest(query)
}

export const getHeaderMenuApi = () => {
  const query = `query menus {
    menus {
      nodes {
        databaseId
        name
        menuItems {
          nodes {
            label
            connectedObject {
              ... on Page {
                databaseId
                pageKey {
                  key
                }
              }
            }
          }
        }
      }
    }
  }`
  return graphQlRequest(query)
}

export const getHomePageContentApi = (id) => {
  const query = `
    query HomePageContent {
      page(id: "${id}", idType: DATABASE_ID) {
        seo {
          metaDesc
          title
          metaRobotsNofollow
          metaRobotsNoindex
        }
      
        homeHeroSection: home {
          bgImage {
            node {
              mediaItemUrl
            }
          }
          heroHeading {
            line
          }
          heroText
        }
        contentSection: home {
          contentText
          contentHeading
          contentButton1
          contentButton2
        }
        carSliderSection: home {
          carSlider {
            text
            image {
              node {
                mediaItemUrl
              }
            }
            mobileImg {
              node {
                mediaItemUrl
              }
            }
          }
          sliderSignatureImage {
            node {
              mediaItemUrl
            }
            
          }
        }
        carDetailsSliderSection: home {
          contentSlider {
            mainImage {
              node {
                mediaItemUrl
              }
            }
            subHeading
            heading
            text
            button
            buttonUrl
          }
        }
        
        footerCtaSection: home {
          fctaImage {
            node {
              mediaItemUrl
            }
          }
          ctaImageMobile {
            node {
              mediaItemUrl
            }
          }
          fctaHeading
          fctaText
          fctaButton
          ctaSignatureImage {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  `;
  return graphQlRequest(query, { id });
};

export const getAboutUsPageContentApi = (id) => {
  const query = `
    query AboutUsPageContent{
      page(id: "${id}", idType: DATABASE_ID) {
        seo {
          metaDesc
          title
          metaRobotsNofollow
          metaRobotsNoindex
        }
        aboutHoreSection: aboutUs {
          banerHeading {
            line
          }
          bannerText
          bannerBgImage {
            node {
              mediaItemUrl
            }
          }
        
        }
      
        mainContentSection: aboutUs {
          imageText
          mainContentText
          mainContentHeading
          contentMobileImg {
            node {
              mediaItemUrl
            }
          }
          mainContentImage {
            node {
              mediaItemUrl
            }
          }
        }
        imageAndtextSection: aboutUs {
          content2Heading
          content2imageText
          content2Text
          content2ImageMobile{
            node{
              mediaItemUrl
            }
          }
          content2image {
            node {
              mediaItemUrl
            }
          }
        }
        imageAndtextSecondSection: aboutUs {
          content3Heading
          content3ImageText
          content3Text
          content3ImageMobile{
            node{
              mediaItemUrl
            }
          }
          content3Image {
            node {
              mediaItemUrl
            }
          }

        }
        textSecondSection: aboutUs {
          content4Heading
          content4Text
        }
        footerCtaSection: aboutUs {
          ctaImageText
          ctaImage {
            node {
              mediaItemUrl
            }
          }
          ctaImageMobile {
            node {
              mediaItemUrl
            }
          }
          ctaHeading
          ctaText
          ctaButton
          signatureImage {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  `;
  return graphQlRequest(query, { id });
};

export const getAdvisePageContentApi = (id) => {
  const query = `
    query AdvicePageContent{
      page(id: "${id}", idType: DATABASE_ID) {
        seo {
          metaDesc
          title
          metaRobotsNofollow
          metaRobotsNoindex
        }
        adviceHeroSection: advice {
          bannerBgImage {
            node {
              mediaItemUrl
            }
          }
          bannerHeading {
            line
          }
          bannerText
        }
        adviceContentSection: advice {
          heading
          contentText
        }
        adviceFooterCtaSection: advice {
          ctaImage {
            node {
              mediaItemUrl
            }
          }
          ctaHeading
          contentText
          ctaButton1
          ctaButton2
          signatureImage {
            node {
              mediaItemUrl
            }
          }
        }
        advicePropertiesSection: advice {
          propertiesSubHeading
          propertiesHeading
          propertiesText
          accordion {
            title
            description
            image {
              node {
                mediaItemUrl
              }
            }
          }
        }
        adviceCarSliderSection: advice {
          carslider {
            sliderImage {
              node {
                mediaItemUrl
              }
            }
            sliderMobileImage {
              node {
                mediaItemUrl
              }
            }
            title
            carName
          }
        }
      }
    }
  `;
  return graphQlRequest(query, { id });
};

export const getCollectionPageContentApi = (id) => {
  const query = `
    query CollectionPageContent($id: ID!) {
      page(id: $id, idType: DATABASE_ID) {
        seo {
          metaDesc
          title
          metaRobotsNofollow
          metaRobotsNoindex
        }
        collectionHeroSection: collection {
          bannerBgImage {
            node {
              mediaItemUrl
            }
          }
          bannerHeading {
            line
          }
          bannerText
        }
        collectionContentSection: collection {
          contentSubHeading
          contentHeading
          contentText
        }
        collectionCtaSection: collection {
          ctaImage {
            node {
              mediaItemUrl
            }
          }
          ctaImageMobile {
            node {
              mediaItemUrl
            }
          }
          ctaHeading
          ctaText
          ctaButton1
          ctaButton2
          signatureImage {
            node {
              mediaItemUrl
            }
          }
        }
        collectionButtons: collection {
          viewAll
          vewModal
          loadMore
        }
      }
    }
  `;

  return graphQlRequest(query, { id });
};

export const getCarDetailsContentApi = (language, categoryId) => {
  const query = `
  query CollectionPageContent($language: String!) {
  
    collectionCarCategorySection: carCategories(where: {language: $language, orderby: NAME, order: DESC}) {
      nodes {
        databaseId
        name
        count
      }
      
    }
    collectionCarsDataSection:cars(where: {language: $language},first: 200) {
    nodes {
      title
      slug
      translations {
        languageCode
        slug
      }
      databaseId
      carCategories {
        nodes {
          name
          databaseId
        }
      }
      carData {
        galleryImages {
          image {
            node {
              mediaItemUrl
            }
          }
        }
        constructionYear
        kmStand
        price
      }
    }
    }
  }
  `
  return graphQlRequest(query, { language })
}


export const getAutomationPagaContentFetchApi = async (slug) => {
  return graphQlRequestFetch(automationQueryBySlug, { slug });
};

export const getAutomationPageContentApi = (slug) => {
  return graphQlRequest(automationQueryBySlug, { slug });
};


export const getNotFoundPageContentApi = (id) => {
  const query = `
    query PageNotFound($id: ID!) {
      page(id: $id, idType: DATABASE_ID) {
        seo {
          metaDesc
          title
          metaRobotsNofollow
          metaRobotsNoindex
        }
        bannerSection:notfound {
          bannerBgImage {
            node {
              mediaItemUrl
            }
          }
          bannerText
          bannerHeading
          bannerButton
        }
        ctaSection:notfound {
          ctaText
          ctaButton
          ctaHeading
          signatureImage {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  `;
  return graphQlRequest(query, { id });
};


export const getContactPageContentApi = (id) => {
  const query = `
  query ContactPageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      seo {
        metaDesc
        title
        metaRobotsNofollow
        metaRobotsNoindex
      }
      contactHeroSection:contactPage {
        bannertext
        bannerHeading {
          line
        }
        bannerBgImage {
          node {
            mediaItemUrl
          }
        }
      }
      contactSection:contactPage {
        contactSubHeading
        contactHeading
        detailsHeading
        address
        kvkNumberTitle
        kvkNumber
        phoneNumber
        email
      }
      contactUsFormSection:contactPage {
        contactFormTab
        contactnamelabel
        contactEmailLabel
        contactPhoneNumberLabel
        contactMessageLabel
        contactFormSendButton
      }
        privacyPolicySection:contactPage{
          privacyPolicyPdf {
                     node {
                       mediaItemUrl
                    }
          }
          privacyPolicyUrlText
          privacyPolicyText
      }
      sellingFormSection:contactPage {
        sellingTabTitle
        sellingNameLabel
        sellingEmailLabel
        sellingPhoneLabel
        sellingMessageLabel
        placeLabel
        licenseLabel
        imageLabel
        maxSizeLabel
        sellingButtonText
      }
      articlesSection:contactPage {
        articleSubHeading
        articleHeading
        articles {
          title
          buttonText
          url
        }
      }
      contactSliderSection:contactPage {
        sliderTitle
        sliderText
        sliderItems {
          image {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  }
  `
  return graphQlRequest(query, { id })
}

export const getSpeedPageContentApi = (id) => {
  const query = `
    query SpeedPageContent {
      page(id: "${id}", idType: DATABASE_ID) {
        seo {
          metaDesc
          title
          metaRobotsNofollow
          metaRobotsNoindex
        }
        speedContentSection: speed {
          contentHeading
          contentText
        }
        speedHeroSection: speed {
          bannerBgImage {
            node {
              mediaItemUrl
            }
          }
          bannerHeading
          bannerText
          bannerSubHeading {
            line
          }
        }
        speedSliderSection: speed {
          sliderItems {
            image {
              node {
                mediaItemUrl
              }
            }
            mobileImage {
              node {
                mediaItemUrl
              }
            }
          }
          sliderTitle
          slidersubtitle
        }
        speedSliderContentSection: speed {
          content2SubHeading
          content2Heading
          content2Text
          galleryHeading
        }
        speedProjectCardSection: speed {
          loadMore
          projectHeading
          projectCards {
            image {
              node {
                mediaItemUrl
              }
            }
            subTitle
            title
          }
        }
        speedGallerySectionn:speed {
          galleryItems {
             subTitle
            title
            image {
              node {
                mediaItemUrl
              }
            }
           
          }
        }
        speedCtaSection:speed {
          ctaImage {
            node {
              mediaItemUrl
            }
          }
          ctaImageMobile{
            node {
              mediaItemUrl
            }
          }
          ctaHeading
          ctatext
          ctaButton    
          signatureImage {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  `;
  return graphQlRequest(query, { id });
};

export const getFutureProjectsApi = (id) => {
  const query = `query carList {
    cars(
      where: {taxQuery: {taxArray: {field: ID, taxonomy: CARCATEGORY, terms: "${id}"}}}
      first: 200
    ) {
      nodes {
        title
        databaseId
        slug
        carCategories {
          nodes {
            name
            databaseId
            translations {
              databaseId
              languageCode
            }
          }
        }
        carData {
          bannerBgImage {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  }`;
  return graphQlRequest(query);
}

export const getFutureProjectCatergoryTrancelations = (id) => {
  const query = `query MyQuery2 {
  carCategory(id: "${id || 49}", idType: DATABASE_ID) {
    translations {
      databaseId
      languageCode
      name
    }
  }
}`;
  return graphQlRequest(query);
}

export const getCollectiePageLabelApi = (language) => {
  const query = `{
    translatedStrings(domain: "vandenberg-strings", language: "${language}") {
      id
      translated
    }
  }`;
  return graphQlRequest(query);
}

export const getAppDetailsApi = (code) => {
  return getRequest(`/wp-json/wc/v3/global-data?lang_code=${code}`);
}

export const postSellCarDetails = (payload) => {
  return postRequest('/wp-json/wc/v3/selling-porsche', payload)
}

export const postContactUsDetailsApi = (payload) => {
  return postRequest('/wp-json/wc/v3/contact-data', payload);
}
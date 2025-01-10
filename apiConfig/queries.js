export const automationQuery = `
query CarData($id: ID!) {
  car(id: $id, idType: DATABASE_ID){
    slug
    carCategories {
      nodes {
        databaseId
        name
      }
    }
    translations {
      languageCode
      slug
      databaseId
    }
    seo {
      metaDesc
      title
      metaRobotsNofollow
      metaRobotsNoindex
    }
    heroSection: carData {
      bannerBgImage {
        node {
          mediaItemUrl
        }
      }
      bannerText {
        line
      }
    }
    featureSection: carData {
      type
      motor
      body
      constructionYear
      kmStand
      colour
      status
      price
    }
    sliderSection:carData {
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
       text
      }
  }
  detailsSection:carData {
    descriptionTitle
    description
    highlightsTitle
    motorHighHeading
    motorHighlights {
      points
    }
    exteriorHighheading
    exteriorHighlights {
      points
    }
    interiorHighHeading
    interiorhighlights {
      points
    }
    safetyHighHeading
    safetyHighlights {
      points
    }
}

  }

}
`

const query = ` 
    slug
    carCategories {
      nodes {
        databaseId
        name
      }
    }
    seo {
      metaDesc
      title
      metaRobotsNofollow
      metaRobotsNoindex
    }
    heroSection: carData {
      bannerBgImage {
        node {
          mediaItemUrl
        }
      }
      bannerText {
        line
      }
    }
    featureSection: carData {
      type
      motor
      body
      constructionYear
      kmStand
      colour
      status
      price
    }
    sliderSection:carData {
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
        text
      }
    }
    detailsSection:carData {
      descriptionTitle
      description
      highlightsTitle
      motorHighHeading
      motorHighlights {
        points
      }
      exteriorHighheading
      exteriorHighlights {
        points
      }
      interiorHighHeading
      interiorhighlights {
        points
      }
      safetyHighHeading
      safetyHighlights {
        points
      }
    }`

export const automationQueryBySlug = `
query CarDataBySlug($slug: ID!) {
  car(id: $slug, idType: URI){
     ${query}
      languageCode
    translations {
      languageCode
      ${query}
    }
  }
}
`
import { PAGE_DEFAULT_ID, PAGES_KEY } from "@/constant";

export const RGBToHSL = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  return (100 * (2 * l - s)) / 2;
};

export function changeLogo(section, logo) {
  let rgbColor = getComputedStyle(section).backgroundColor;

  if (rgbColor.startsWith("rgba")) {
    // Either evaluate the opacity as well or define a fallback
  } else {
    let rgbArr = rgbColor
      .substring(4, rgbColor.length - 1)
      .replace(/ /g, "")
      .split(",");
    let l = RGBToHSL(
      parseInt(rgbArr[0]),
      parseInt(rgbArr[1]),
      parseInt(rgbArr[2])
    );

    if (l > 50) {
      // Assuming 50 as the threshold for lightness
      logo.classList.add("humBackgroundColor");
    } else {
      logo.classList.remove("humBackgroundColor");
    }
  }
}

export const getPageId = (pageKey, menu) => {
  if (typeof menu === "string") {
    menu = JSON.parse(menu);
  }
  if (!Array.isArray(menu)) {
    menu = [];
  }
  const page = menu.find(
    (item) => pageKey == item?.connectedObject?.pageKey?.key
  );
  const id = page?.connectedObject?.databaseId || PAGE_DEFAULT_ID[pageKey];
  return id;
};

export function formatNumbersInString(input) {
  if (input === undefined || input === null || input === "") {
    return ""; // or return any default value you prefer
  }

  return input.toString().replace(/(\d+(\.\d+)?)/g, (match) => {
    const number = parseFloat(match);
    if (isNaN(number)) {
      return match;
    }
    return number.toFixed(2);
  });
}

export function getCurrentBrowser() {
  if (typeof navigator !== "undefined") {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown browser";

    if (/edg/i.test(userAgent)) {
      browserName = "Edge";
    } else if (/opr\//i.test(userAgent) || /opera/i.test(userAgent)) {
      browserName = "Opera";
    } else if (
      /chrome|crios|crmo/i.test(userAgent) &&
      !/edg/i.test(userAgent)
    ) {
      browserName = "Chrome";
    } else if (/firefox|fxios/i.test(userAgent)) {
      browserName = "Firefox";
    } else if (
      /safari/i.test(userAgent) &&
      !/chrome|crios|crmo/i.test(userAgent)
    ) {
      browserName = "Safari";
    } else if (/msie|trident/i.test(userAgent)) {
      browserName = "Internet Explorer";
    }

    return browserName;
  }
}

export function getObjectByKey(obj, ...keys) {
  return keys.reduce((acc, key) => {
    if (acc && acc.hasOwnProperty(key)) {
      return acc[key];
    } else {
      return {};
    }
  }, obj);
}

export const PAGE_KEYS = [
  {
    key: "home",
    id: PAGE_DEFAULT_ID[PAGES_KEY?.HOME],
    field: "hero_bg_image",
  },
  {
    key: "about",
    id: PAGE_DEFAULT_ID[PAGES_KEY?.ABOUT_US],
    // field: "banner_bg_image.url",
    fields: ["banner_bg_image.url", "baner_heading", "banner_text"],
  },
  {
    key: "restauratie",
    id: PAGE_DEFAULT_ID[PAGES_KEY?.ADVISE],
    fields: ["bg_image", "banner_heading", "banner_text"],
  },
  {
    key: "speed",
    id: PAGE_DEFAULT_ID[PAGES_KEY?.SPEED],
    fields: [
      "bannerBgImage.url",
      "bannerHeading",
      "bannerSubHeading",
      "bannerText",
    ],
  },
  {
    key: "collectie",
    id: PAGE_DEFAULT_ID[PAGES_KEY?.COLLECTIVE],
    fields: ["banner_bg_image.url", "banner_heading", "banner_text"],
  },
  {
    key: "contact",
    id: PAGE_DEFAULT_ID[PAGES_KEY?.CONTACT],
    fields: ["bannerBgImage.url", "bannerHeading", "bannerText"],
  },
];

export const fetchPageContent = async (pageID, fields) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/wp-json/wp/v2/pages/${pageID}?acf_format=standard&_fields=acf`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    // Extract the required fields dynamically
    const result = {};
    // fields?.forEach((field) => {
    //   const fieldParts = field?.split(".");
    //   let value = data?.acf;
    //   for (let part of fieldParts) {
    //     value = value?.[part];
    //   }
    //   result[field] = value;
    // });

    fields?.forEach((field) => {
      const fieldParts = field?.split(".");
      let value = data?.acf;
      let current = result;

      fieldParts.forEach((part, index) => {
        if (index === fieldParts.length - 1) {
          // Assign the value to the final part
          current[part] = value?.[part];
        } else {
          // Create nested objects dynamically
          current[part] = current[part] || {};
          current = current[part];
          value = value?.[part];
        }
      });
    });

    return result;
  } catch (error) {
    console.error(`Error fetching data for page ID ${pageID}:`, error);
    return null;
  }
};

export const fetchAndStoreData = async () => {
  const bannerData = {};

  for (const page of PAGE_KEYS) {
    const data = await fetchPageContent(page.id, page.fields);
    if (data) {
      bannerData[page.key] = data;
    }
  }

  // Save the data in localStorage
  localStorage.setItem("bannerData", JSON.stringify(bannerData));
};

// useEffect(() => {
//   const fetchAndStoreData = async () => {
//     const bannerData = {};

//     for (const page of PAGE_KEYS) {
//       const data = await fetchPageContent(page.id, page.fields);
//       if (data) {
//         bannerData[page.key] = data;
//       }
//     }

//     // Save the data in localStorage
//     localStorage.setItem("bannerData", JSON.stringify(bannerData));
//   };

//   fetchAndStoreData();
// }, []);

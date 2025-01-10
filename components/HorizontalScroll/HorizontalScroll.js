import gsap from "gsap";
import Link from "next/link";
import React, { useLayoutEffect, useRef } from "react";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import placeholerImage from "@/public/car-placeholder.jpg";

import Image from "next/image";
import HorizontalScrollStyles from "../../styles/HorizontalScroll.module.scss";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll({ data }) {
  const component = useRef();
  const slider = useRef();
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 992px)");

    if (mediaQuery.matches) {
      let ctx = gsap.context(() => {
        const panelsSections = gsap.utils.toArray(".panels");
        for (var i = 0; i < panelsSections.length; i++) {
          let thePanelsSection = panelsSections[i];
          const panels = gsap.utils.toArray(
            ".panelsContainer .panel",
            thePanelsSection
          );
          const panelsContainer =
            thePanelsSection.querySelector(".panelsContainer");
          const widthRatio = thePanelsSection.dataset.widthratio;
          gsap.set([panelsContainer, panels], {
            height: window.innerHeight * 0.6,
          });
          gsap.set(panels, { width: window.innerHeight * widthRatio });
          var totalPanelsWidth = 0;
          panels.forEach(function (panel) {
            totalPanelsWidth += panel.offsetWidth;
          });
          gsap.set(panelsContainer, { width: totalPanelsWidth });
          gsap.set(thePanelsSection, {
            height:
              panelsContainer.offsetWidth -
              innerWidth +
              panelsContainer.offsetHeight,
          });
          let scrollTween = gsap.to(panels, {
            x: -totalPanelsWidth + innerWidth,
            ease: "none",
            scrollTrigger: {
              trigger: panelsContainer,
              pin: true,
              start: "top",
              end: function () {
                const endPin = panelsContainer.offsetWidth - innerWidth;
                return "+=" + endPin;
              },
              scrub: true,
            },
          });
        }
      }, component);

      return () => ctx.revert();
    }
  }, []);

  return (
    <>
      <section
        className={`${HorizontalScrollStyles.HorizontalScroll} dark horizontalSection`}
        ref={component}
      >
        <div className="wrapper">
          <div className="container panels">
            <div ref={slider} className="horizontalContainer panelsContainer">
              {data?.length > 0 &&
                data.map((item, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`${HorizontalScrollStyles.HorizontalScrollBlock} horizontalBlock flexWrapper panel`}
                    >
                      <div
                        className={`${`${HorizontalScrollStyles.imgWrapper} imgBlock`} imgBlock`}
                      >
                        <Image
                          src={
                            item?.mainImage?.node?.mediaItemUrl ||
                            placeholerImage?.src
                          }
                          width={508}
                          height={710}
                          alt="slider image"
                        />
                      </div>
                      <div className={HorizontalScrollStyles.contentWrapper}>
                        <h3>{item?.subHeading}</h3>
                        <h2>{item?.heading}</h2>
                        <p>{item?.text}</p>
                        <div className="btnWrapper">
                          <Link href={item?.button?.href} className="btn">
                            {item?.button?.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

'use client'
import Link from 'next/link'


import Image from "next/image";
import '../../styles/highlighter.scss'
import '../../styles/pageNotFound.scss'
import signatureBig from "../../public/signatureBig.png";
import backgroundImage from "../../public/newHero.webp";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotFoundPageData } from '@/store/pages/action';
import { PAGES_LINKS } from '@/constant';
import { usePathname, useRouter } from 'next/navigation';

export default function NotFoundComponent() {
  const { bannerSection, ctaSection, seo } = useSelector(state => state?.pages?.notFound) || {}
  const { userLanguage } = useSelector(state => state?.common) || {}
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchNotFoundPageData())
  }, [dispatch, userLanguage])


  useEffect(() => {
    if (pathname === PAGES_LINKS.HOME) {
      router.refresh()
    }
  }, [pathname, router])
  return (
    <>
      <section className="notFoundBanner" style={{ backgroundImage: `url(${bannerSection?.bannerBgImage?.node?.mediaItemUrl})` }}>
        <div className="container">
          {bannerSection ? <div className="content">
            <p>{bannerSection?.bannerText}</p>
            <h1 dangerouslySetInnerHTML={{ __html: bannerSection?.bannerHeading }}></h1>
            <div className="redirect">
              <Link href={PAGES_LINKS.HOME}>{bannerSection?.bannerButton}</Link>
            </div>
          </div> : null}
        </div>
      </section>
      <section className="highlighter light homeAlt alt">
        <div className="wrapper">
          <div className="container">
            <div className="flexWrapper">
              <h2>{ctaSection?.ctaHeading}</h2>
              <div className="content">
                <p>{ctaSection?.ctaText}</p>
                <div className="btn_wrapper">
                  <div className="btnWrapper"><Link href={PAGES_LINKS.CONTACT} className="btn">{ctaSection?.ctaButton}</Link></div>
                </div>
                <img src={ctaSection?.signatureImage?.node?.mediaItemUrl} alt="peter signature" width={292} height={72} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
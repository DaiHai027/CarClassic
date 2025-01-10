
import { NextResponse } from 'next/server';
import { getAutomationPagaContentFetchApi } from './apiConfig/services';
import { NOT_FOUND_PATH } from './constant';

export default async function middleware(request) {
    const { pathname } = request.nextUrl;
    const slug = pathname?.split('/')?.[2];

    if (slug) {
        try {
            const { data } = await getAutomationPagaContentFetchApi(slug) || {};

            if (!data?.car) {
                return NextResponse.redirect(new URL(NOT_FOUND_PATH, request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL(NOT_FOUND_PATH, request.url));
        }

    } else {
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/collectie/:path*',
};
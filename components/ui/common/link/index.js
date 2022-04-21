import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ActiveLink({ children, activeLinkClass, ...props }) {
    const { pathname } = useRouter();
    let className = children.props.className || '';
    if (pathname === props.href) {
        className += activeLinkClass
            ? ` ${activeLinkClass}`
            : ' text-indigo-900';
    }
    return (
        <Link {...props}>{React.cloneElement(children, { className })}</Link>
    );
}

import React from "react"
import { Link } from "react-router-dom"

interface FooterLink {
    to?: string
    href?: string
    icon?: React.ReactNode
    label: string
    linkType?: "internal" | "external"
}

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const displayYear = currentYear === 2025 ? '2025' : `2025 - ${currentYear}`

    const socialLinks: FooterLink[] = [
        { href: 'https://facebook.com', icon: <i className="pi pi-facebook" />, label: 'Facebook' },
        { href: 'https://instagram.com', icon: <i className="pi pi-instagram" />, label: 'Instagram' },
        { href: 'https://www.linkedin.com/in/donat-halimi-0719b0193/', icon: <i className="pi pi-linkedin" />, label: 'LinkedIn' },
        { href: 'https://github.com/DonatHalimi/hotel-management-system', icon: <i className="pi pi-github" />, label: 'GitHub' },
    ]

    const quickLinks: FooterLink[] = [
        { to: '/profile', label: 'Profile' },
        { to: '/dashboard', label: 'Dashboard' },
    ]

    const customerService: FooterLink[] = [
        { to: '/profile', label: 'Profile' },
        { to: '/dashboard', label: 'Dashboard' },
    ]

    const contactLinks: FooterLink[] = [
        { linkType: 'external', href: 'mailto:test@example.com', icon: <i className="pi pi-envelope" />, label: 'Email' },
        { linkType: 'external', href: 'tel:044221112', icon: <i className="pi pi-phone" />, label: 'Phone' },
    ]

    const renderLink = (link: FooterLink) => {
        const baseClass = "text-gray-800 hover:text-gray-900 flex items-center space-x-1"
        if (link.linkType === 'external') {
            return (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={baseClass}>
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                </a>
            )
        }
        return (
            <Link key={link.label} to={link.to!} className={`${baseClass} hover:underline`}>
                {link.icon}
                <span>{link.label}</span>
            </Link>
        )
    }

    return (
        <footer className="bg-gray-100 text-gray-800 px-6 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4 select-none">
                        <Link to="/" className="hover:underline text-gray-800">HMS</Link>
                    </h3>
                    <p className="mb-4">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim, perferendis sint cum in numquam consequuntur amet aperiam.</p>
                    <div className="flex space-x-4">{socialLinks.map(renderLink)}</div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 select-none">Quick Links</h3>
                    <ul className="space-y-2">{quickLinks.map(link => <li key={link.label}>{renderLink(link)}</li>)}</ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 select-none">Customer Service</h3>
                    <ul className="space-y-2">{customerService.map(link => <li key={link.label}>{renderLink(link)}</li>)}</ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 select-none">Contact Us</h3>
                    <div className="flex flex-col space-y-2">{contactLinks.map(renderLink)}</div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm">
                &copy; {displayYear} HMS. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
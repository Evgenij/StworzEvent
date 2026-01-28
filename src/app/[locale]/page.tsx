import Link from 'next/link'

const links = [
	{ href: '/', label: 'Home' },
	{ href: '/ui', label: 'UI' },
	{ href: '/auth/register', label: 'Registration' },
	{ href: '/Login', label: 'Login' },
]

export default function Page() {
	return <div>{
		<ol>
			{links.map(({ href, label }) => <li key={href}><Link href={`pl/${href}`}>{label}</Link></li>)}
		</ol>
	}</div>;
}

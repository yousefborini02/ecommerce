import Link from 'next/link'
import React from 'react'
function NotFoundPage() {
	return (
	<div>
			<h1>Page Not Found </h1>
			<Link href="/"><button>Go To Home Page</button></Link>
	</div>
	)
}

export default NotFoundPage
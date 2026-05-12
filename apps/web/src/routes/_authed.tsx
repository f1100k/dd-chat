import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed")({
	beforeLoad: async ({ context, location }) => {
		const me = await context.loadMe()
		if (!me) {
			throw redirect({
				to: "/login",
				search: { redirect: location.pathname },
			})
		}
		return { me }
	},
	component: () => <Outlet />,
})

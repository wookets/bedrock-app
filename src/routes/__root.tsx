import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import * as React from "react"
import appCss from "~/app.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg">Bedrock Example App</div>
        <hr />
        {children}
        {/* <TanStackRouterDevtools position="bottom-right" /> */}
        <Scripts />
      </body>
    </html>
  )
}

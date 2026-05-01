import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [
		starlight({
			title: "ghostcall",
			description:
				"Zero-deployment batching program and TypeScript SDK for CREATE-style eth_call requests.",
			editLink: {
				baseUrl: "https://github.com/volga-sh/ghostcall/edit/main/docs/",
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/volga-sh/ghostcall",
				},
			],
			sidebar: [
				{
					label: "Start",
					items: [
						{ label: "Overview", slug: "index" },
						{ label: "Getting Started", slug: "getting-started" },
					],
				},
				{
					label: "Reference",
					items: [
						{ label: "SDK API", slug: "sdk" },
						{ label: "Protocol", slug: "protocol" },
						{ label: "Limits", slug: "limits" },
					],
				},
				{
					label: "Project",
					items: [{ label: "Development", slug: "development" }],
				},
			],
		}),
	],
});

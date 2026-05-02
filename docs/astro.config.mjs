import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://ghostcall.volga.sh",
	integrations: [
		starlight({
			title: "ghostcall",
			description:
				"Zero-deployment batching program and TypeScript SDK for CREATE-style eth_call requests.",
			head: [
				{
					tag: "link",
					attrs: {
						rel: "preconnect",
						href: "https://fonts.googleapis.com",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "preconnect",
						href: "https://fonts.gstatic.com",
						crossorigin: "",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "stylesheet",
						href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap",
					},
				},
			],
			customCss: ["./src/styles/volga.css"],
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
					label: "Start Here",
					items: [
						{ label: "Getting Started", slug: "getting-started" },
						{ label: "Examples", slug: "examples" },
					],
				},
				{
					label: "API Reference",
					items: [
						{ label: "Overview", slug: "api" },
						{
							label: "aggregateDecodedCalls",
							slug: "api/aggregate-decoded-calls",
						},
						{ label: "aggregateCalls", slug: "api/aggregate-calls" },
						{ label: "encodeCalls", slug: "api/encode-calls" },
						{ label: "decodeResults", slug: "api/decode-results" },
						{ label: "GhostcallSubcallError", slug: "api/subcall-error" },
						{ label: "Types", slug: "api/types" },
					],
				},
				{
					label: "Concepts",
					items: [
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

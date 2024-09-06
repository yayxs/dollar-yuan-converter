import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import mdx from "@mdx-js/rollup";

const viteConfig = defineConfig({
	plugins: [
		{
			enforce: "pre",
			...mdx({
				/* jsxImportSource: …, otherOptions… */
			}),
		},
		react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
	],
});

export default viteConfig;

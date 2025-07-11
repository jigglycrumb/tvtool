import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	root: ".",
	base: "./",
	build: {
		outDir: "docs",
		emptyOutDir: true,
	},
	resolve: {
		extensions: [".js", ".jsx", ".css"],
	},
	server: {
		host: true,
		port: 3000,
		hot: true,
	},
	// Support JSX in .js files
	esbuild: {
		loader: "jsx",
		include: /src\/.*\.jsx?$/,
		exclude: [],
	},
});

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [tailwindcss()],
	appType: "spa",
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:20255",
				changeOrigin: false,
			},
		},
	},
});

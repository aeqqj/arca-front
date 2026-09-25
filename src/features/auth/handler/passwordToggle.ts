import { initIcons } from "../../../shared/icons.ts";

export function passwordToggle() {
	const passwordInput =
		document.querySelector<HTMLInputElement>("#password")!;
	const toggleBtn =
		document.querySelector<HTMLInputElement>("#togglePassword")!;

	toggleBtn.addEventListener("click", () => {
		const isPassword = passwordInput.type === "password";
		passwordInput.type = isPassword ? "text" : "password";

		toggleBtn.innerHTML = isPassword
			? '<i data-lucide="eye" class="w-5 h-5 text-fg4 hover:text-fg2 transition-colors"></i>'
			: '<i data-lucide="eye-closed" class="w-5 h-5 text-fg4 hover:text-fg2 transition-colors"></i>';

		initIcons();
	});
}

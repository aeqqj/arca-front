import { initIcons } from "../../shared/icons.ts";
import { passwordToggle } from "./handler/passwordToggle.ts";
import { signIn } from "../../core/auth/session.ts";
import { navigate } from "../../core/router/router.ts";
import { nextRenderToken, paint, isCurrentRender } from "../../core/render.ts";

export function SignInPage() {
	const token = nextRenderToken();
	paint(
		token,
		`
        <section class="flex-1 flex justify-center items-center select-none text-fg1">
            <div class="w-94 flex flex-col gap-6">
                <div class="flex items-baseline gap-4">
                    <h3 class="font-semibold text-shadow-lg text-6xl">sign in</h3>
                </div>
                <form id="signin-form" action="" class="flex flex-col gap-6">
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-body-lg text-fg2">Email</label>
                        <input type="email" id="email" placeholder="Enter your email" class="auth-input text-fg2">
                    </div>
                    <div class="flex flex-col gap-1">
                        <div class="flex flex-col gap-1">
                            <label for="password" class="text-fg2">Password</label>
                            <div class="relative">
                                <input type="password" id="password" placeholder="Enter your password" class="auth-input text-fg2 w-full">
                                <button type="button" id="togglePassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-fg4">
                                    <i data-lucide="eye-closed" class="w-5 h-5 hover:text-fg2 transition-colors"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="w-full text-end text-fg4 text-sm hover:text-fg2 transition-colors">Forgot Password?</button>
                    </div>
                    <p id="auth-error" class="text-bad text-sm hidden"></p>
                    <button id="signin-submit" class="px-5 py-3 bg-fg1 text-base text-bg1 border border-white rounded-xs hover:bg-fg1/90 transition-colors">Sign In</button>
                    <p class="w-full text-center text-fg4 text-sm">No account? <a href="/auth/signup" class="underline hover:text-fg2 transition-colors">Sign up</a></p>
                </form>
            </div>
        </section>
    `,
	);
	initIcons();
	passwordToggle();

	const form = document.querySelector<HTMLFormElement>("#signin-form")!;
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const email = document
			.querySelector<HTMLInputElement>("#email")!
			.value.trim();
		const password =
			document.querySelector<HTMLInputElement>("#password")!.value;
		const errorEl =
			document.querySelector<HTMLParagraphElement>("#auth-error")!;
		const submitBtn =
			document.querySelector<HTMLButtonElement>("#signin-submit")!;

		errorEl.classList.add("hidden");
		submitBtn.disabled = true;
		submitBtn.textContent = "Signing in…";

		void signIn(email, password)
			.then(() => navigate("/"))
			.catch((err: unknown) => {
				if (!isCurrentRender(token)) {
					return;
				}
				submitBtn.disabled = false;
				submitBtn.textContent = "Sign In";
				errorEl.textContent =
					err instanceof Error ? err.message : "Sign in failed";
				errorEl.classList.remove("hidden");
			});
	});
}

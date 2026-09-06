import { initIcons } from "../../shared/icons.ts";
import { passwordToggle } from "./handler/passwordToggle.ts";
import { signUp } from "../../core/auth/session.ts";
import { navigate } from "../../core/router/router.ts";
import { nextRenderToken, paint, isCurrentRender } from "../../core/render.ts";

export function SignUpPage() {
	const token = nextRenderToken();
	paint(
		token,
		`
        <section class="flex-1 flex justify-center items-center select-none text-fg1">
            <div class="w-94 flex flex-col gap-6">
                <div class="flex items-baseline gap-4">
                    <h3 class="font-semibold text-shadow-lg text-6xl">sign up</h3>
                </div>
                <form id="signup-form" action="" class="flex flex-col gap-6">
                    <div class="flex gap-4">
                        <div class="flex flex-col gap-1 flex-1">
                            <label for="firstName" class="text-body-lg text-fg2">First name</label>
                            <input type="text" id="firstName" placeholder="First name" class="auth-input text-fg2">
                        </div>
                        <div class="flex flex-col gap-1 flex-1">
                            <label for="lastName" class="text-body-lg text-fg2">Last name</label>
                            <input type="text" id="lastName" placeholder="Last name" class="auth-input text-fg2">
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-body-lg text-fg2">Email</label>
                        <input type="email" id="email" placeholder="Enter your email" class="auth-input text-fg2">
                    </div>
                    <div class="flex flex-col gap-1 mb-1">
                        <label for="password" class="text-fg2">Password</label>
                        <div class="relative">
                            <input type="password" id="password" placeholder="Enter your password" class="auth-input text-fg2 w-full">
                            <button type="button" id="togglePassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-fg4">
                                <i data-lucide="eye" class="w-5 h-5 hover:text-fg2 transition-colors"></i>
                            </button>
                        </div>
                    </div>
                    <p id="auth-error" class="text-bad text-sm hidden"></p>
                    <div class="flex flex-col gap-2">
                        <button id="signup-submit" class="px-5 py-3 bg-fg1 text-base text-bg1 border border-white rounded-xs hover:bg-fg1/90 transition-colors">Sign up</button>
                        <p class="w-full text-center text-fg4 text-sm">Already have an account? <a href="/auth/signin" class="underline hover:text-fg2 transition-colors">Sign in</a></p>
                    </div>
                </form>
            </div>
        </section>
    `,
	);
	initIcons();
	passwordToggle();

	const form = document.querySelector<HTMLFormElement>("#signup-form")!;
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const firstName = document
			.querySelector<HTMLInputElement>("#firstName")!
			.value.trim();
		const lastName = document
			.querySelector<HTMLInputElement>("#lastName")!
			.value.trim();
		const email = document
			.querySelector<HTMLInputElement>("#email")!
			.value.trim();
		const password =
			document.querySelector<HTMLInputElement>("#password")!.value;
		const errorEl =
			document.querySelector<HTMLParagraphElement>("#auth-error")!;
		const submitBtn =
			document.querySelector<HTMLButtonElement>("#signup-submit")!;

		if (!firstName.trim() && !lastName.trim()) {
			errorEl.textContent = "Please enter your first or last name.";
			errorEl.classList.remove("hidden");
			return;
		}
		if (!email || !password) {
			errorEl.textContent = "Email and password are required.";
			errorEl.classList.remove("hidden");
			return;
		}

		errorEl.classList.add("hidden");
		submitBtn.disabled = true;
		submitBtn.textContent = "Creating account…";

		void signUp({
			first_name: firstName,
			last_name: lastName,
			email,
			password,
		})
			.then(() => navigate("/"))
			.catch((err: unknown) => {
				if (!isCurrentRender(token)) {
					return;
				}
				submitBtn.disabled = false;
				submitBtn.textContent = "Sign up";
				errorEl.textContent =
					err instanceof Error ? err.message : "Sign up failed";
				errorEl.classList.remove("hidden");
			});
	});
}

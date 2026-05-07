export function schoolCard(name: string) {
    return `
        <div class="h-36 w-64 p-4 text-foreground0 bg-background1 rounded-xl shadow-xl transition duration-200 hover:scale-103 hover:-translate-y-1">
            <h2>${name}</h2>
        </div>
    `
}

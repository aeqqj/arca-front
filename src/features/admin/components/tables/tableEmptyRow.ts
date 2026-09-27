export function tableEmptyRow(columnCount: number, message: string): string {
	return /* HTML */ `
		<tr>
			<td colspan="${columnCount}" class="py-12 text-center text-fg5">
				${message}
			</td>
		</tr>
	`;
}

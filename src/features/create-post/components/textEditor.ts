import {
	createEditor,
	$getRoot,
	$createParagraphNode,
	$createTextNode,
	$getSelection,
	$isRangeSelection,
	FORMAT_TEXT_COMMAND,
	UNDO_COMMAND,
	REDO_COMMAND,
	type LexicalEditor,
} from "lexical";
import {
	registerRichText,
	$createQuoteNode,
	HeadingNode,
	QuoteNode,
	$createHeadingNode,
} from "@lexical/rich-text";
import { createEmptyHistoryState, registerHistory } from "@lexical/history";
import { $setBlocksType } from "@lexical/selection";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
	ListNode,
	ListItemNode,
	INSERT_UNORDERED_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND,
	$isListNode,
	registerList,
} from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";

const EDITOR_ID = "post-editor";

export function textEditor(): string {
	return `
    <div class="text-editor-wrapper w-full flex flex-col gap-2">
      <p class="text-fg2">Description</p>

      <div class="border border-border rounded-xs overflow-hidden">
        <div class="toolbar flex items-center gap-1 px-3 py-2 border-b border-border flex-wrap bg-bg3">
          <button type="button" data-cmd="undo" class="toolbar-btn">
            <i data-lucide="undo2" class="w-4 h-4"></i>
          </button>
          <button type="button" data-cmd="redo" class="toolbar-btn">
            <i data-lucide="redo2" class="w-4 h-4"></i>
          </button>

          <div class="w-px h-5 bg-separator mx-1"></div>

          <div class="relative toolbar-select">
            <select data-cmd="block-type" class="appearance-none pr-6 cursor-pointer">
              <option value="paragraph">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
            <i data-lucide="chevron-down" class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4"></i>
          </div>

          <div class="w-px h-5 bg-separator mx-1"></div>

          <button type="button" data-cmd="bold" class="toolbar-btn">
            <i data-lucide="bold" class="w-4 h-4"></i>
          </button>
          <button type="button" data-cmd="italic" class="toolbar-btn">
            <i data-lucide="italic" class="w-4 h-4"></i>
          </button>
          <button type="button" data-cmd="underline" class="toolbar-btn">
            <i data-lucide="underline" class="w-4 h-4"></i>
          </button>
          <button type="button" data-cmd="strikethrough" class="toolbar-btn">
            <i data-lucide="strikethrough" class="w-4 h-4"></i>
          </button>
          <button type="button" data-cmd="code" class="toolbar-btn">
            <i data-lucide="code" class="w-4 h-4"></i>
          </button>

          <div class="w-px h-5 bg-separator mx-1"></div>

          <button type="button" data-cmd="bullet-list" class="toolbar-btn">
            <i data-lucide="list" class="w-4 h-4"></i>
          </button>
          <button type="button" data-cmd="ordered-list" class="toolbar-btn">
            <i data-lucide="list-ordered" class="w-4 h-4"></i>
          </button>
          <button type="button" data-cmd="quote" class="toolbar-btn">
            <i data-lucide="quote" class="w-4 h-4"></i>
          </button>
        </div>

        <div
          id="${EDITOR_ID}"
          class="editor-input min-h-60 px-4 py-3 text-fg1 outline-none bg-bg2 is-empty text-body-md hover:bg-bg3/60 transition-colors"
          contenteditable="true"
          data-placeholder="Start typing here..."
        ></div>
      </div>
    </div>
  `;
}

let editorInstance: LexicalEditor | null = null;

export function initTextEditor(): LexicalEditor {
	const root = document.getElementById(EDITOR_ID) as HTMLDivElement;

	const editor = createEditor({
		namespace: "CreatePostEditor",
		onError: (e: Error) => console.error(e),
		nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
		theme: {
			text: {
				bold: "font-bold",
				italic: "italic",
				underline: "underline",
				strikethrough: "line-through",
				code: "font-mono bg-bg3 px-1 rounded-xs text-sm",
			},
			heading: {
				h1: "text-2xl ",
				h2: "text-xl ",
				h3: "text-lg ",
			},
			quote: "border-l-2 border-border pl-3 italic text-fg2",
			list: {
				ul: "list-disc pl-5",
				ol: "list-decimal pl-5",
				listitem: "my-1",
			},
		},
	});

	editor.setRootElement(root);
	registerRichText(editor);
	registerHistory(editor, createEmptyHistoryState(), 300);
	registerList(editor);

	editor.update(() => {
		const rootNode = $getRoot();
		if (rootNode.getFirstChild() === null) {
			const p = $createParagraphNode();
			p.append($createTextNode(""));
			rootNode.append(p);
		}
	});

	const toolbar = root.parentElement?.querySelector(".toolbar");

	toolbar?.addEventListener("click", (e) => {
		const btn = (e.target as HTMLElement).closest<HTMLElement>(
			"[data-cmd]",
		);
		if (!btn) return;
		const cmd = btn.dataset.cmd;

		switch (cmd) {
			case "undo":
				editor.dispatchCommand(UNDO_COMMAND, undefined);
				break;
			case "redo":
				editor.dispatchCommand(REDO_COMMAND, undefined);
				break;
			case "bold":
				editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
				break;
			case "italic":
				editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
				break;
			case "underline":
				editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
				break;
			case "strikethrough":
				editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
				break;
			case "code":
				editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
				break;
			case "bullet-list":
				editor.update(() => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection)) return;
					const anchorNode = selection.anchor.getNode();
					const parent = anchorNode.getTopLevelElementOrThrow();
					if (
						$isListNode(parent) &&
						parent.getListType() === "bullet"
					) {
						editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
					} else {
						editor.dispatchCommand(
							INSERT_UNORDERED_LIST_COMMAND,
							undefined,
						);
					}
				});
				break;
			case "ordered-list":
				editor.update(() => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection)) return;
					const anchorNode = selection.anchor.getNode();
					const parent = anchorNode.getTopLevelElementOrThrow();
					if (
						$isListNode(parent) &&
						parent.getListType() === "number"
					) {
						editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
					} else {
						editor.dispatchCommand(
							INSERT_ORDERED_LIST_COMMAND,
							undefined,
						);
					}
				});
				break;
			case "quote":
				editor.update(() => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection)) return;
					$setBlocksType(selection, () => $createQuoteNode());
				});
				break;
		}

		editor.focus();
	});

	const blockSelect = root.parentElement?.querySelector<HTMLSelectElement>(
		'[data-cmd="block-type"]',
	);

	blockSelect?.addEventListener("change", () => {
		const value = blockSelect.value;

		editor.update(() => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection)) return;

			switch (value) {
				case "h1":
					$setBlocksType(selection, () => $createHeadingNode("h1"));
					break;
				case "h2":
					$setBlocksType(selection, () => $createHeadingNode("h2"));
					break;
				case "h3":
					$setBlocksType(selection, () => $createHeadingNode("h3"));
					break;
				case "paragraph":
				default:
					$setBlocksType(selection, () => $createParagraphNode());
					break;
			}
		});

		editor.focus();
	});

	editor.registerUpdateListener(({ editorState }) => {
		editorState.read(() => {
			const rootNode = $getRoot();
			const isEmpty =
				rootNode.getChildrenSize() === 1 &&
				rootNode.getFirstChild()?.getTextContent() === "";
			root.classList.toggle("is-empty", isEmpty);

			const selection = $getSelection();
			if (!$isRangeSelection(selection)) return;

			const node = selection.anchor.getNode().getTopLevelElementOrThrow();

			if (blockSelect) {
				blockSelect.value = $isHeadingNode(node)
					? node.getTag()
					: "paragraph";
			}
		});
	});

	editorInstance = editor;
	return editor;
}

export function getTextEditor(): LexicalEditor | null {
	return editorInstance;
}

export function getEditorHtmlContent(): string {
	if (!editorInstance) return "";
	return editorInstance
		.getEditorState()
		.read(() => $generateHtmlFromNodes(editorInstance!, null));
}

export function getEditorTextContent(): string {
	if (!editorInstance) return "";
	return editorInstance
		.getEditorState()
		.read(() => $getRoot().getTextContent());
}

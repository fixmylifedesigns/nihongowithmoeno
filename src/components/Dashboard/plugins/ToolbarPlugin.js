// src/components/Dashboard/plugins/ToolbarPlugin.js
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2">
      {/* Text Formatting */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Underline"
      >
        <u>U</u>
      </button>

      <span className="w-px h-6 bg-gray-200 mx-2" />

      {/* Headings */}
      <button
        type="button"
        onClick={() => formatHeading("h1")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => formatHeading("h2")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => formatHeading("h3")}
        className="p-2 hover:bg-gray-100 rounded"
        title="Heading 3"
      >
        H3
      </button>

      <span className="w-px h-6 bg-gray-200 mx-2" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        className="p-2 hover:bg-gray-100 rounded"
        title="Bullet List"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
        className="p-2 hover:bg-gray-100 rounded"
        title="Numbered List"
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND)}
        className="p-2 hover:bg-gray-100 rounded"
        title="Remove List"
      >
        Remove List
      </button>
    </div>
  );
}

// components/ContentRenderer.js
import { $getRoot, createEditor } from 'lexical';

export default function ContentRenderer({ content }) {
  function convertToHtml(content) {
    try {
      // Parse the JSON content if it's a string
      const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Process each node
      function processNode(node) {
        if (node.type === 'text') {
          let text = node.text;
          // Apply text formatting
          if (node.format & 1) text = `<strong>${text}</strong>`; // Bold
          if (node.format & 2) text = `<em>${text}</em>`; // Italic
          if (node.format & 4) text = `<u>${text}</u>`; // Underline
          return text;
        }

        if (node.children) {
          const childContent = node.children.map(child => processNode(child)).join('');
          
          switch (node.type) {
            case 'root':
              return childContent;
            case 'paragraph':
              return `<p>${childContent}</p>`;
            case 'heading':
              return `<${node.tag} class="font-bold">${childContent}</${node.tag}>`;
            case 'list':
              return `<${node.tag} class="${node.listType === 'bullet' ? 'list-disc' : 'list-decimal'} ml-4">${childContent}</${node.tag}>`;
            case 'listitem':
              return `<li>${childContent}</li>`;
            default:
              return childContent;
          }
        }
        
        return '';
      }

      return processNode(parsedContent.root);
    } catch (error) {
      console.error('Error converting content:', error);
      return '<p>Error displaying content</p>';
    }
  }

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: convertToHtml(content) }}
    />
  );
}
// FILE: /components/site-blocks/ParagraphBlock.tsx

type Block = {
  id: string;
  type: 'paragraph';
  content: string;
};

export default function ParagraphBlock({ block }: { block: Block }) {
  return (
    <p className="mt-4 text-gray-700 whitespace-pre-wrap">
      {block.content}
    </p>
  );
}

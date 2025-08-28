// FILE: /components/site-blocks/HeadingBlock.tsx

// Definimos los tipos que este componente espera recibir
type Block = {
  id: string;
  type: 'heading';
  content: string;
};

export default function HeadingBlock({ block }: { block: Block }) {
  return (
    <h2 className="text-3xl font-bold text-gray-800 mt-8 first:mt-0">
      {block.content}
    </h2>
  );
}

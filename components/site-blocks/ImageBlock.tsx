// FILE: /components/site-blocks/ImageBlock.tsx

type Block = {
  id: string;
  type: 'image';
  content: { src: string; alt: string };
};

export default function ImageBlock({ block }: { block: Block }) {
  const { src, alt } = block.content;
  const imageUrl = src || 'https://placehold.co/1200x600?text=Imagen+no+disponible';
  
  return (
    <div className="mt-8">
      <img 
        src={imageUrl} 
        alt={alt || 'Imagen descriptiva del sitio'} 
        className="w-full h-auto rounded-lg shadow-md"
      />
    </div>
  );
}

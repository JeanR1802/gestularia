import { templates } from "@/app/templates";
import { notFound } from "next/navigation";
import { CreateSiteForm } from "./_components/CreateSiteForm";

// 1. Definimos un tipo claro y explícito para las props de la página
type CreateSitePageProps = {
  params: {
    templateId: string;
  };
};

// 2. La función ahora acepta un solo argumento 'props' con el tipo que definimos.
//    Desestructuramos 'params' DENTRO de la función, no en la firma.
export default function CreateSiteFromTemplatePage(props: CreateSitePageProps) {
  const { params } = props;
  const { templateId } = params;
  
  const template = templates.find((t) => t.id === templateId);

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
            Paso Final
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            Ponle un nombre a tu sitio
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Estás usando la plantilla <span className="font-bold text-gray-800 dark:text-gray-200">{template.name}</span>. Elige un subdominio para publicarlo.
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto">
          <div className="bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-8">
            <CreateSiteForm templateId={template.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default function LegalPage({ title, content, placeholder }: { title: string; content?: string | null; placeholder: string }) {
  return (
    <div className="max-w-4xl mx-auto pt-12 pb-24 min-h-[60vh]">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-12 border-b border-gray-900 pb-6">{title}</h1>
      <div className="text-gray-300 whitespace-pre-line leading-relaxed font-light">{content || placeholder}</div>
    </div>
  );
}

import { ArrowLeftCircleIcon } from "@heroicons/react/20/solid";

export default function PreviousButton({ goPrev }: { goPrev: () => void }) {
  return (
    <div className="inline-block mt-5 border border-primary rounded-4xl px-5">
      <button
        className="w-full py-3 text-center text-primary font-semibold cursor-pointer inline-flex items-center justify-center"
        onClick={goPrev}
        type="button"
      >
        <ArrowLeftCircleIcon className="w-5 h-5 mr-2" />
        Etape précédente
      </button>
    </div>
  );
}

import { ArrowRightCircleIcon, CheckIcon } from "@heroicons/react/20/solid";
import plumbing from "../assets/plumbing.svg";
import electricity from "../assets/electricity.svg";
import glazing from "../assets/glazing.svg";
import heating from "../assets/heating.svg";
import household_appliances from "../assets/household_appliances.svg";
import locksmith from "../assets/locksmith.svg";
import type { Question } from "common";
import PreviousButton from "./PreviousButton.tsx";

const iconMap: Record<string, string> = {
  plumbing: plumbing,
  electricity: electricity,
  glazing: glazing,
  heating: heating,
  household_appliances: household_appliances,
  locksmith: locksmith,
};

export default function QuestionView({
  isFirst,
  currentQuestion,
  goNext,
  goPrev,
}: {
  isFirst: boolean;
  currentQuestion: Question;
  goNext: (id: string) => Promise<void>;
  goPrev: () => Promise<void>;
}) {
  // Si c'est la 1ᵉ question, on affiche des icônes pour la séléction du type d'intervention
  if (isFirst) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="inline-grid grid-cols-3 justify-items-center gap-5">
          {currentQuestion.options.map((option) => (
            <div
              key={option.id}
              className="bg-secondary rounded-xl shadow-xl cursor-pointer hover:scale-110 transition-transform relative flex flex-col items-center justify-center w-36 h-36 p-10"
              onClick={() => goNext(option.id)}
            >
              <img
                src={iconMap[option.id]}
                alt={option.label}
                className="w-16 h-16"
              />

              <span className="absolute bottom-2 text-center text-white bg-primary px-2 font-semibold">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* On est dans le cas où on a choisi un type d'intervention, on affiche les options de la question suivante. */}
      <div className="mt-10 bg-white rounded-xl shadow-xl p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 justify-items-center gap-5">
          {currentQuestion?.options.map((option) => (
            <button
              key={option.id}
              className="bg-gray-100 text-start rounded-md cursor-pointer hover:scale-101 transition-transform w-full py-6 px-5 flex items-center justify-between"
              onClick={() => goNext(option.id)}
            >
              <span className="px-2 font-semibold">{option.label}</span>

              <ArrowRightCircleIcon className="w-6 h-6 text-primary" />
            </button>
          ))}
        </div>

        <PreviousButton goPrev={goPrev} />
      </div>
      <div className="mt-10 bg-green-100 rounded-xl p-10 max-w-7xl mx-auto space-y-2">
        <p className="flex items-center justify-center">
          <CheckIcon className="h-4 w-4 text-green-900 mr-2" />
          Plus de{" "}
          <span className="font-semibold ml-1">
            1500 professionnels qualifiés
          </span>
          , recrutés selon des critères et un processus stricts
        </p>
        <p className="flex items-center justify-center">
          <CheckIcon className="h-4 w-4 text-green-900 mr-2" />
          Fourchette tarifaire{" "}
          <span className="font-semibold ml-1">connue à l’avance</span>,
          incluant le déplacement ainsi qu’un devis gratuit
        </p>
        <p className="flex items-center justify-center">
          <CheckIcon className="h-4 w-4 text-green-900 mr-2" />
          Intervention <span className="font-semibold mx-1">7j/7 24h/24</span>
          pour les dépannages d’urgence
        </p>
      </div>
    </>
  );
}

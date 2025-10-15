import { useQuestions } from "./hooks/useQuestions.ts";
import clsx from "clsx";
import Divider from "./components/Divider.tsx";
import plumbing from "./assets/plumbing.svg";
import electricity from "./assets/electricity.svg";
import glazing from "./assets/glazing.svg";
import heating from "./assets/heating.svg";
import household_appliances from "./assets/household_appliances.svg";
import locksmith from "./assets/locksmith.svg";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import Header from "./components/Header.tsx";
import { CheckCircleIcon, CurrencyEuroIcon } from "@heroicons/react/24/outline";

const iconMap: Record<string, string> = {
  plumbing: plumbing,
  electricity: electricity,
  glazing: glazing,
  heating: heating,
  household_appliances: household_appliances,
  locksmith: locksmith,
};

function App() {
  const { currentQuestion, diagnostic, loading, error, goNext, goPrev } =
    useQuestions();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Cas 1 : Diagnostic final
  if (diagnostic) {
    return (
      <>
        <Header />

        <div className="bg-background h-screen flex flex-col items-center">
          <div className="mt-10 flex max-w-7xl">
            <div className="flex-3 bg-white rounded-xl shadow-xl p-10 mx-auto space-y-7">
              <img
                src="https://solutions-horizon.com/wp-content/uploads/2019/08/diagnostic-entreprise-1030x579.jpg"
                className="w-full h-96 object-cover rounded-xl"
                alt="diagnostic-image"
              />
              <h2 className="text-2xl font-bold text-gray-700">Bon à savoir</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {diagnostic.description}
              </p>
            </div>
            <div className="ml-10 flex-2">
              <div className="bg-secondary rounded-xl shadow-xl p-10 mx-auto">
                <h2 className="text-2xl font-bold text-primary">
                  {diagnostic.title}
                </h2>

                <ul className="mt-5 space-y-3 text-gray-700 font-semibold">
                  <li className="flex items-center space-x-3">
                    <CurrencyEuroIcon className="w-5 h-5 text-primary" />
                    <span>{diagnostic.price}</span>
                  </li>

                  {diagnostic.includes.map((include) => (
                    <li className="flex items-center space-x-3" key={include}>
                      <CheckCircleIcon className="w-5 h-5 text-primary" />
                      <span>{include}</span>
                    </li>
                  ))}
                </ul>

                <button className="mt-5 bg-primary text-white py-5 px-7 rounded-full font-semibold cursor-pointer">
                  Demander une intervention
                </button>
              </div>

              <div className="text-xs mt-10 text-gray-700">
                <p className="font-semibold">
                  Vous êtes recontactés sous 20 minutes après votre passage de
                  commande.
                </p>
                <p>
                  Si l’origine de votre panne nécessite un diagnostic
                  complémentaire, il s’agit d’une intervention à part entière
                  demandant l'expertise d’un professionnel. Celle-ci fera
                  l’objet d’une facturation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Cas 2 : Affichage des questions
  const isFirstQuestion = currentQuestion?.id === 1;

  return (
    <>
      {/* Dans la landing page, on n'affiche pas le header, on l'affiche uniquement dans les autres pages */}
      {!isFirstQuestion && <Header />}
      <div
        className={clsx(
          isFirstQuestion ? "bg-landing" : "bg-background",
          "h-screen",
        )}
      >
        <h1
          className={clsx(
            isFirstQuestion ? "text-6xl text-white pt-52" : "text-4xl pt-32",
            "font-bold text-center",
          )}
        >
          {currentQuestion?.question}
        </h1>
        <Divider
          className={clsx(
            "mx-auto mt-10",
            isFirstQuestion ? "text-white" : "text-primary",
          )}
        />

        {/* Si c'est la 1ᵉ question, on affiche des icônes pour la séléction du type d'intervention */}
        {isFirstQuestion ? (
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
        ) : (
          <>
            {/* On est dans le cas où on a choisi un type d'intervention, on affiche les options de la question suivante */}
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

              <div className="inline-block mt-5 border border-primary rounded-4xl px-5">
                <button
                  className="w-full py-3 text-center text-primary font-semibold cursor-pointer inline-flex items-center justify-center"
                  onClick={goPrev}
                >
                  <ArrowLeftCircleIcon className="w-5 h-5 mr-2" />
                  Etape précédente
                </button>
              </div>
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
                Intervention{" "}
                <span className="font-semibold mx-1">7j/7 24h/24</span>pour les
                dépannages d’urgence
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;

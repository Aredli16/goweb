import Header from "./Header.tsx";
import { CheckCircleIcon, CurrencyEuroIcon } from "@heroicons/react/24/outline";
import type { Diagnostic } from "common";

export default function DiagnosticView({
  diagnostic,
}: {
  diagnostic: Diagnostic;
}) {
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
                demandant l'expertise d’un professionnel. Celle-ci fera l’objet
                d’une facturation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Header from "./Header.tsx";
import { CheckCircleIcon, CurrencyEuroIcon } from "@heroicons/react/24/outline";
import type { Diagnostic, ISession } from "common";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import Checkbox from "./Checkbox.tsx";
import type { FormEvent } from "react";

export default function SubmissionForm({
  diagnostic,
  submitSession,
}: {
  diagnostic: Diagnostic;
  submitSession: (
    firstName: string,
    lastName: string,
    streetAddress: string,
    postalCode: string,
    phoneNumber: string,
    email: string,
    paymentMethod: string,
  ) => Promise<ISession | void>;
}) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const streetAddress = formData.get("streetAddress") as string;
    const postalCode = formData.get("postalCode") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const paymentMethod = formData.get("paymentMethod") as string;

    const session = await submitSession(
      firstName,
      lastName,
      streetAddress,
      postalCode,
      phoneNumber,
      email,
      paymentMethod,
    );

    if (session && session.isSubmitted) {
      alert("Votre commande a été validée avec succès !");
      window.location.reload();
    } else {
      alert("Une erreur est survenue lors de la validation de votre commande.");
    }
  };

  return (
    <>
      <Header />
      <div className="bg-background h-screen flex flex-col items-center">
        <div className="mt-10 flex max-w-7xl">
          <form
            className="flex-3 bg-white rounded-xl shadow-xl p-10 mx-auto space-y-7"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-bold text-gray-700">
              <span className="px-3 py-1 bg-primary text-white text-xl">1</span>{" "}
              Informations
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-10">
              <Input name="firstName">Prénom</Input>
              <Input name="lastName">Nom</Input>
              <Input name="streetAddress">Adresse (numéro et voie)</Input>
              <Input name="postalCode">Code postal</Input>
              <Input name="phoneNumber">Téléphone</Input>
              <Input name="email">Adresse email</Input>
            </div>

            <h3 className="text-2xl font-bold text-gray-700 mt-10">
              <span className="px-3 py-1 bg-primary text-white text-xl">2</span>{" "}
              Modes de paiement
            </h3>

            <div className="mt-6 space-y-3">
              <label className="flex justify-between items-center bg-gray-100 px-6 py-4 rounded-xl cursor-pointer">
                <span className="font-semibold text-gray-800">
                  Payer sur place
                </span>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="onsite"
                  className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-md cursor-pointer checked:border-primary checked:bg-primary transition-all"
                />
              </label>

              <label className="flex justify-between items-center bg-gray-100 px-6 py-4 rounded-xl cursor-pointer">
                <span className="font-semibold text-gray-800">
                  Payer en ligne
                </span>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-md cursor-pointer checked:border-primary checked:bg-primary transition-all"
                />
              </label>
            </div>

            <div className="mt-10 space-y-4">
              <Checkbox>
                <span>
                  J’accepte les{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    conditions générales d’utilisation du service
                  </a>
                </span>
              </Checkbox>

              <Checkbox>
                <span>
                  J’ai bien pris connaissance des{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    dispositions relatives au droit de rétractation
                  </a>
                </span>
              </Checkbox>

              <Checkbox>
                Je souhaite recevoir par voie électronique des offres
                commerciales personnalisées
              </Checkbox>
            </div>

            <Button>Valider ma commande</Button>
          </form>
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
            </div>

            <div className="bg-secondary rounded-xl shadow-xl p-10 mx-auto mt-10">
              <h2 className="text-2xl font-bold text-primary">
                Besoin d’une assistance téléphonique ?
              </h2>

              <div className="flex justify-center">
                <Button>Afficher le numéro</Button>
              </div>
            </div>

            <div className="text-xs mt-10 text-gray-700">
              <p className="font-semibold">
                Vous êtes recontactés sous 20 minutes après votre passage de
                commande.
              </p>
              <p>
                L'artisan vous proposera un rendez-vous dès qu'il aura pris
                connaissance de votre commande. Une fois sur place, il analysera
                la situation et vous présentera un devis définitif. En cas de
                non acceptation du devis, aucun frais n'est engagé (ni
                déplacement, ni établissement du devis).
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

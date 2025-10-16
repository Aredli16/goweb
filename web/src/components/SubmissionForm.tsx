import Header from "./Header.tsx";
import { CheckCircleIcon, CurrencyEuroIcon } from "@heroicons/react/24/outline";
import type { Diagnostic, ISession } from "common";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import Checkbox from "./Checkbox.tsx";
import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useState,
} from "react";
import PreviousButton from "./PreviousButton.tsx";
import { z } from "zod";

const submissionSchema = z.object({
  firstName: z.string().min(1, "Ce champ est requis"),
  lastName: z.string().min(1, "Ce champ est requis"),
  streetAddress: z.string().min(1, "Ce champ est requis"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit comporter 5 chiffres"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Le numéro de téléphone doit comporter 10 chiffres"),
  email: z.email("L'adresse email n'est pas valide"),
  paymentMethod: z.enum(["onsite", "online"], {
    error: () => ({
      message: "Veuillez choisir un mode de paiement valide",
      path: ["paymentMethod"],
    }),
  }),
});

export default function SubmissionForm({
  diagnostic,
  submitSession,
  setShowForm,
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
  setShowForm: Dispatch<SetStateAction<boolean>>;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const result = submissionSchema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [issue.path[0]]: issue.message,
        }));
      });

      return;
    }

    setErrors({});

    const session = await submitSession(
      result.data.firstName,
      result.data.lastName,
      result.data.streetAddress,
      result.data.postalCode,
      result.data.phoneNumber,
      result.data.email,
      result.data.paymentMethod,
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
      <div className="bg-background min-h-screen flex flex-col items-center">
        <div className="mt-10 flex flex-col sm:flex-row max-w-7xl">
          <form
            className="flex-3 sm:order-1 order-2 bg-white rounded-xl shadow-xl p-10 mx-auto space-y-7"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-bold text-gray-700">
              <span className="px-3 py-1 bg-primary text-white text-xl">1</span>{" "}
              Informations
            </h3>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10">
              <Input
                name="firstName"
                error={errors.firstName}
                onChange={handleInputChange}
              >
                Prénom
              </Input>
              <Input
                name="lastName"
                error={errors.lastName}
                onChange={handleInputChange}
              >
                Nom
              </Input>
              <Input
                name="streetAddress"
                error={errors.streetAddress}
                onChange={handleInputChange}
              >
                Adresse (numéro et voie)
              </Input>
              <Input
                name="postalCode"
                error={errors.postalCode}
                onChange={handleInputChange}
              >
                Code postal
              </Input>
              <Input
                name="phoneNumber"
                error={errors.phoneNumber}
                onChange={handleInputChange}
              >
                Téléphone
              </Input>
              <Input
                name="email"
                error={errors.email}
                onChange={handleInputChange}
              >
                Adresse email
              </Input>
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
              {errors.paymentMethod && (
                <p className="mt-1 text-xs font-semibold text-red-400">
                  {errors.paymentMethod}
                </p>
              )}
            </div>

            <div className="mt-10 space-y-4">
              <Checkbox required>
                <span>
                  J’accepte les{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    conditions générales d’utilisation du service
                  </a>
                </span>
              </Checkbox>

              <Checkbox required>
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

            <div className="sm:flex items-center gap-x-3">
              <PreviousButton
                goPrev={() => {
                  setShowForm(false);
                }}
              />
              <Button>Valider ma commande</Button>
            </div>
          </form>
          <div className="sm:ml-10 mb-10 flex-2 sm:order-2 order-1">
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

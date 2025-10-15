import { useQuestions } from "./hooks/useQuestions.ts";
import clsx from "clsx";
import Divider from "./components/Divider.tsx";
import Header from "./components/Header.tsx";
import DiagnosticView from "./components/DiagnosticView.tsx";
import QuestionView from "./components/QuestionView.tsx";

function App() {
  const {
    currentQuestion,
    diagnostic,
    loading,
    error,
    goNext,
    goPrev,
    submitSession,
  } = useQuestions();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Cas 1 : Diagnostic final
  if (diagnostic)
    return (
      <DiagnosticView diagnostic={diagnostic} submitSession={submitSession} />
    );

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

        {currentQuestion && (
          <QuestionView
            isFirst={isFirstQuestion}
            currentQuestion={currentQuestion}
            goNext={goNext}
            goPrev={goPrev}
          />
        )}
      </div>
    </>
  );
}

export default App;

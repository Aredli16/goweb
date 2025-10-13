import {useEffect, useState} from "react";

interface Question {
    id: number;
    question: string;
    options: {id: string, label: string}[];
    next?: Record<string, number>
}

export function useQuestions() {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [questionsHistory, setQuestionsHistory] = useState<Question[]>([])

    useEffect(() => {
        fetch("http://localhost:3000/api/questions")
            .then(res => res.json())
            .then(data => {
                setCurrentQuestion(data)
                setLoading(false)
                setQuestionsHistory([data])
            })
            .catch(err => {
                setError(err.message)
            })
    }, [])

    const goNext = async (answerId: string) => {
        if (!currentQuestion) return;

        setLoading(true)
        const res = await fetch(`http://localhost:3000/api/questions/${currentQuestion.id}/${answerId}`, {method: "post"})
        const next = await res.json()
        setCurrentQuestion(next)
        setQuestionsHistory(prev => [...prev, next])
        setLoading(false)
    }

    const goPrev = () => {
        if (questionsHistory.length <= 1) return; // On ne peut pas revenir avant la première question
        setLoading(true)
        setQuestionsHistory(prev => {
            const newHistory = prev.slice(0, -1)
            setCurrentQuestion(newHistory[newHistory.length - 1])
            setLoading(false)
            return newHistory
        })
    }

    return {
        currentQuestion,
        loading,
        error,
        goNext,
        goPrev
    }
}
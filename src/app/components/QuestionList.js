'use client'

import { useState, useEffect } from 'react'
import { fetchQuestions } from '../lib/app.js';

export default function QuestionList() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        fetchQuestions().then((data)=>{
          setQuestions(data)
        });    
      } catch (error) { 
        console.error('Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestion()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Questions</h2>
      {questions.length === 0 ? (
        <p className="text-gray-600">No questions available.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((question, index) => (
            <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{question.question}</h3>
              <ul className="list-disc list-inside space-y-1">
                {JSON.parse(question.options).map((option, optIndex) => (
                  <li key={optIndex} className={`text-gray-600 ${optIndex === question.answer ? 'font-semibold text-green-600' : ''}`}>
                    {option}
                    {optIndex === question.answer && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Correct</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                Status: <span className={`font-semibold ${question.answered ? 'text-green-600' : 'text-yellow-600'}`}>
                  {question.answered ? 'Answered' : 'Not Answered'}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
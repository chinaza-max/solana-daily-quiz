'use client'

import { useState, useEffect } from 'react'
import { fetchQuestions } from '../lib/app.js';
import axios from 'axios'

export default function QuestionList() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)


  const handleSubmit = async (id) => {

    setLoading2(true)


    try {
        const response = await axios.post('/api/questions', {
          type:'delete',
          id
        })
        console.log('Response:', response.data)
        setLoading2(false)

        setLoading3(true)
        setTimeout(() => {
          setLoading3(false)
        }, 3000);

        fetchQuestions().then((data)=>{
          setQuestions(data)
        });   
        
      } catch (error) {
        console.error('Error deleting the question:', error)
        setLoading2(false)

      } finally {
        setLoading2(false)

       // setLoading(false) // Stop loading spinner
      }
    
  }

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
      <div className="flex justify-center items-center h-64 mt-5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    
    <div className="bg-white shadow-md rounded-lg p-6" style={{marginTop:"70px"}}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Questions</h2>
      <div className={`${loading3 ?"":"hidden"} text-center  text-green-700 `}>
              DELETED SUCCESSFULLY
        </div>
      <div className={`${loading2 ?"":"hidden"} text-center`}>
            <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
      </div>

      {questions.length === 0 ? (
        <p className="text-gray-600">No questions available.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((question, index) => (
            <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{question.question}</h3>
              <ul className="list-disc list-inside space-y-1">
                {/*JSON.parse(*/question.options/*)*/.map((option, optIndex) => (
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
                <button onClick={()=>handleSubmit(question.id)}  class="ml-5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete question </button>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
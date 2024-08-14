'use client'

import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default function QuestionForm() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [answer, setAnswer] = useState(0)
  const [loading, setLoading] = useState(false) 
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault()

    // Implementation for submitting the question
    console.log({ question, options, answer })
    // Reset form
   /* setQuestion('')
    setOptions(['', '', '', ''])
    setAnswer(0)*/
    setLoading2(true)

    try {
        const response = await axios.post('/api/questions', {
          question,
          options,
          answer,
          type:'create'
        })
        console.log('Response:', response.data)
        
        setLoading3(true)
        setTimeout(() => {
          setLoading3(false)
        }, 3000);

        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
        
        setTimeout(() => {
          setQuestion('')
          setOptions(['', '', '', ''])
          setAnswer(0)
          setLoading2(false)
        }, 400);

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
        console.error('Error submitting the question:', error)
      } finally {
        setLoading(false) // Stop loading spinner
        setLoading2(false)
      }
    
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 mt-5">

  
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create New Question 2</h2>

        <div className={`${loading2 ?"":"hidden"} text-center`}>
            <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>


        <div className={`${loading3 ?"":"hidden"} text-center  text-green-700 `}>
              UPLOADED SUCCESSFULLY
        </div>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {options.map((option, index) => (
          <div key={index}>
            <label htmlFor={`option-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Option {index + 1}
            </label>
            <input
              id={`option-${index}`}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options]
                newOptions[index] = e.target.value
                setOptions(newOptions)
              }}
              placeholder={`Enter option ${index + 1}`}
              className="w-full  text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        ))}
        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer
          </label>
          <select
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(Number(e.target.value))}
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {options.map((_, index) => (
              <option key={index} value={index}>
                Option {index + 1}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Create Question
        </button>
      </form>
    </div>
  )
}
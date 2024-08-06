'use client'

import { useState } from 'react'
import axios from 'axios'

export default function QuestionForm() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [answer, setAnswer] = useState(0)
  const [loading, setLoading] = useState(false) 



  const handleSubmit = async (e) => {
    e.preventDefault()
    // Implementation for submitting the question
    console.log({ question, options, answer })
    // Reset form
   /* setQuestion('')
    setOptions(['', '', '', ''])
    setAnswer(0)*/

    try {
        const response = await axios.post('/api/questions', {
          question,
          options,
          answer,
        })
        console.log('Response:', response.data)
        
        // Reset form
        setQuestion('')
        setOptions(['', '', '', ''])
        setAnswer(0)
      } catch (error) {
        console.error('Error submitting the question:', error)
      } finally {
        setLoading(false) // Stop loading spinner
      }
    
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Question</h2>
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
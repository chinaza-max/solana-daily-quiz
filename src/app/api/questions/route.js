import { NextResponse } from 'next/server'
import { getQuestions, createQuestion } from '../../utils/anchor-client'

export async function GET() {
  try {
    const questions = await getQuestions()
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { question, options, answer } = await request.json()
    await createQuestion(question, options, answer)
    return NextResponse.json({ message: 'Question created successfully' })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}
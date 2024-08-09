import { NextResponse } from 'next/server';
import { getDB } from '../../lib/db.js';

export async function GET() {
  const db = await getDB();
  const questions = await db.models.Question.findAll({
    where: { answered: false },
  });

  return NextResponse.json(questions);
}

export async function POST(request) {
  const db = await getDB();
  const { question, options, answer } = await request.json();
  const newQuestion = await db.models.Question.create({
    question,
    options,
    answer,
  });
  return NextResponse.json(newQuestion);
}
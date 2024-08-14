import { NextResponse } from 'next/server';
import { getDB } from '../../lib/db.js';

export const  GET = async () =>{
  const db = await getDB();
  const questions = await db.models.Question.findAll({
    where: { answered: false },
  });
  

  return NextResponse.json(questions);
}

export const POST = async (request) =>{
  const db = await getDB();
  const {type, question, options, answer , id } = await request.json();


  if (type === 'create') {

  const newQuestion = await db.models.Question.create({
    question,
    options,
    answer,
  });
  return NextResponse.json(newQuestion);
}
  else if (type === 'delete') {
    if (!id) {
      return NextResponse.json({ error: 'ID is required for deletion' }, { status: 400 });
    }
    const myQuestion = await db.models.Question.findByPk(id);
    if (myQuestion) {

      await myQuestion.destroy();
      return NextResponse.json({ message: 'Question deleted successfully' });
    }
    
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
}
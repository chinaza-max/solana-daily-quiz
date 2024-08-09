// app/api/users/route.js
import { NextResponse } from 'next/server';
import { getDB } from '../../lib/db.js';

export async function GET() {
  try {
    const db = await getDB();
    const users = await db.models.User.findAll({
      order: [['points', 'DESC']],
      limit: 3
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await getDB();
    const { wallet, points } = await request.json();
    const user = await db.models.User.create({ wallet, points });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
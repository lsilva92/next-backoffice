import 'server-only';
import { connectToDatabase } from '@/app/utils/mongodb';
import {  NextRequest, NextResponse } from 'next/server';

const tableName = process.env.MONGO_COLLECTION;

export async function GET() {
  const { client, db } = await connectToDatabase();

  try {
    const collection = db.collection(String(tableName));

    const data = await collection.find({}).toArray();
    return NextResponse.json({data}, { status: 200 });

  } catch (error) {
    console.error('Error getting data from MongoDB:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  } finally {
    client.close();
  }
};


export async function POST(req: NextRequest) {
  const { client, db } = await connectToDatabase();

  try {
    const collection = db.collection(String(tableName));

    const body = await req.json();

    const date = new Date();

    const result = await collection.insertOne({...body, created: new Date(date.getTime())});

    return NextResponse.json({result}, { status: 200 });

  } catch (error) {
    console.error('Error getting data from MongoDB:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  } finally {
    client.close();
  }
};
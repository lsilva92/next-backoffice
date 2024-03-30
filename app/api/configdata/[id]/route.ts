import 'server-only'
import { connectToDatabase } from '@/app/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'bson'; 

const tableName = process.env.MONGO_COLLECTION;


export async function DELETE(req: NextRequest, { params }: { params: { id: string }}){

    const { client, db } = await connectToDatabase();
  
    try {
      const collection = db.collection(String(tableName));
      
      const { id } = params;
  
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      console.log(result)
  
      return NextResponse.json({result}, { status: 200 });
  
    } catch (error) {
      console.error('Error getting data from MongoDB:', error);
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    } finally {
      client.close();
    }
  };


  export async function POST(req: NextRequest, { params }: { params: { id: string }}){

    const { client, db } = await connectToDatabase();
  
    try {
      const collection = db.collection(String(tableName));
      
      const { id } = params;
  
     const body = await req.json();

     const result = await collection.updateOne(
        {_id: new ObjectId(id) }, 
        { $set: {
          ...body
        }
      });
  
      return NextResponse.json({result}, { status: 200 });
  
    } catch (error) {
      console.error('Error getting data from MongoDB:', error);
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    } finally {
      client.close();
    }
  };
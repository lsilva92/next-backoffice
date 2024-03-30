import 'server-only';
import { ObjectId } from 'bson'; 
import { connectToDatabase } from '@/app/utils/mongodb';
import { Column } from '@/types';
import { LocaleRouteNormalizer } from 'next/dist/server/future/normalizers/locale-route-normalizer';
import { Lora } from 'next/font/google';
const tableName = process.env.MONGO_COLLECTION;

export async function getData(){

	const { client, db } = await connectToDatabase();
    const collection = db.collection(String(tableName));
      

    const data = await collection.find({}).toArray();    

	let columns: Column[] = [];

	if(data.length){
		//Use mongo Data to build the columns
		const columnNames: Column[] = Object.keys(data[0]).map(el =>(
			{key: el.toLowerCase(), label: el.toUpperCase(), sortable: true}
		));
		//Add Actions to columns
		columnNames.push({ key: 'actions', label: 'ACTIONS', sortable: false });

		columns = columnNames;
	}
	
	const rows = data.map(el => {
		return{
			_id: el._id.toString(),
			ticket: el.ticket,
			description: el.description,
			bd: el.bd,
			sync: el.sync,
			created: el.created
		}
	});

	client.close();
	
	return {
		rows,
		columns: columns.filter(el => el.key !== '_id')
	}
};

export async function deleteData(id: string) {
	const { client, db } = await connectToDatabase();
  
    try {
      const collection = db.collection(String(tableName));
        
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      return result
  
    } catch (error) {
      console.error('Error getting data from MongoDB:', error);
      return error
    } finally {
      client.close();
    }
}
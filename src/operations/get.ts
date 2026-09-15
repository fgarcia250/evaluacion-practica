import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";



const dynamodb = new DynamoDB({});

export async function getBook(id: string){
    
    const result = await dynamodb.send(
        new GetCommand({
            TableName: process.env.TABLE_NAME,
            Key: { pk: `BOOK#${id}`}
        })
    );

    if(!result.Item)
        return {
            statusCode: 404,
            body: JSON.stringify({ message: `Libro con id ${id} no encontrado. Validar codigo.`})
        };

    return {
        statusCode: 200,
        body: JSON.stringify(result.Item)
    }


}

import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { IBook } from "../../types";
import { randomUUID } from "crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDB({});

export async function createBook(body: string | null ){
    const uuid = randomUUID();

    if(!body)
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Body ausente en el request'}),
        }

    const bodyParsed = JSON.parse(body) as IBook;

    await dynamodb.send(
        new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: {
                pk: `BOOK#${uuid}`,
                ...bodyParsed
            }
        })
    );

    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Libro registrado!', id: uuid})
    }

}
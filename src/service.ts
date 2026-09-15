import { APIGatewayProxyEvent } from 'aws-lambda';
import { createBook } from './operations/create';
import { getBook } from './operations/get';

export const handler = async(event: APIGatewayProxyEvent) => {

    const id = event.pathParameters?.id;

    try {

        switch (event.httpMethod) {
            case 'GET':
                if(!id)
                    return {
                        statusCode: 400,
                        body: JSON.stringify({message: 'Missing path parameter: id'})};
                return getBook(id)
                
            case 'POST':
                return createBook(event.body);
        
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({message: 'Invalid HTTP method'})
                };
        }
        
    } catch (error) {
        console.log(`Error: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({message: `Error: ${error}`})
        }
    }

}
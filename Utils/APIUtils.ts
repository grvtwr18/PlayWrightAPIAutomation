import { APIResponse, APIRequestContext } from '@playwright/test';
import { testConfig } from '../testConfig';
import { Logger } from "tslog";
const log: Logger = new Logger();
let response: APIResponse;
const ConnectionRetryMessage: string = 'Connection try count = ';

export class APIUtils {

    /**
     * 
     * @param request - Accepts the request param of asyc test function of playwright.
     * @param endpoint - The API endpoint to get the resources
     * @param statusCode - Expected status code from the response
     * @param retry - Optional value to retry connection in case expected status code is not recieved.
     * @returns - Response from get endpoint.
     */
    async get(request: APIRequestContext, endpoint: string, statusCode: string, retry?: number): Promise<APIResponse> {

        let retryCount = retry > 1 ? retry : 1;

        for (let i = 1; i <= retryCount; i++) {

            log.info(`${ConnectionRetryMessage} =  ${i}\n`)
            response = await request.get(endpoint);
            log.info(`Response is - \n ${JSON.stringify(response)} \n`);
            log.info(`Response body is - \n ${(await response.body()).toString()} \n`);

            if (response.status().toString().match(statusCode)) {
                return response;
            } else if (i == retryCount) {
                log.error(`${testConfig.maxRetryMessage} Response is not as expected. ${testConfig.actualMessage} status is ${statusCode} OK. `);
                return response;
            } else {
                log.info(`Response status is not as expected. ${testConfig.expectedMessage} ${statusCode}. Retrying get call \n`);
            }
        }
    }

    /**
     * 
     * @param request - Accepts the request param of asyc test function of playwright.
     * @param endpoint - The API endpoint to get the resources.
     * @param requestBody - Request body to post the resources on the endpoint.
     * @param statusCode - Expected status code from the response
     * @param retry - Optional value to retry connection in case expected status code is not recieved.
     * @returns -  Reponse from the post endpoint.
     */
    async post(request: APIRequestContext, endpoint: string, requestBody: any, statusCode: string, retry?: number): Promise<APIResponse> {

        let retryCount = retry > 1 ? retry : 1;
        for (let i = 1; i <= retryCount; i++) {

            log.info(`${ConnectionRetryMessage} = ${i}\n`)
            response = await request.post(endpoint, { data: requestBody });
            log.info(`Request is - \n${JSON.stringify(requestBody)} \n`);
            log.info(`Response is - \n${JSON.stringify(response)} \n`);
            log.info(`Response body is - \n ${(await response.text()).toString()} \n`);

            if (response.status().toString().match(statusCode)) {
                return response;
            } else if (i == retryCount) {
                log.error(`${testConfig.maxRetryMessage} Response status is not as expected. ${testConfig.expectedMessage} ${statusCode}. ${testConfig.actualMessage} is ${response.status().toString()} `);
                return response;
            } else {
                log.info(`Response status is not as expected. ${testConfig.expectedMessage} ${statusCode}. Retrying post call `);
            }
        }
    }

    async getValueForKeyFromJSONResponse(response: APIResponse, keyFromTest: string): Promise<string> {

        let responseBody = JSON.parse(await response.text());

        for (let key in responseBody) {
            if (key.match(keyFromTest)) {
                log.info(`Value for JSON Key - ${key}.In response body is - ${responseBody[keyFromTest]} `)
                return responseBody[keyFromTest];
            }
        }
        log.error(`No match for key.Returning null response for the key -> ${keyFromTest}`);
        return null;
    }
}
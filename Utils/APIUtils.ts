import { APIResponse, APIRequestContext } from '@playwright/test';
import { testConfig } from '../testConfig';
import { Logger } from "tslog";
const log: Logger = new Logger();
let response: APIResponse;
const ConnectionRetryMessage: string = 'Connection try count = ';

export class APIUtils {

    async get(request: APIRequestContext, endpoint: string, statusCode: string, retry?: number): Promise<APIResponse> {

        let retryCount = retry > 1 ? retry : 1;

        for (let i = 1; i <= retryCount; i++) {

            log.info(`${ConnectionRetryMessage} =  ${i}`)
            response = await request.get(endpoint);
            log.info(`Response is - \n ${JSON.stringify(response)} \n`);

            if (response.status().toString().match(statusCode)) {
                return response;
            } else if (i == retryCount) {
                log.error(`${testConfig.maxRetryMessage} Response is not as expected. ${testConfig.actualMessage} status is - ${statusCode} OK. `);
                return response;
            } else {
                log.info(`Response status is not not as expected - ${statusCode}. Retrying to get call`);
            }
        }
    }

    async post(request: APIRequestContext, endpoint: string, requestBody: any, statusCode: string, retry?: number): Promise<APIResponse> {

        let retryCount = retry > 1 ? retry : 1;
        for (let i = 1; i <= retryCount; i++) {

            log.info(`${ConnectionRetryMessage} =  ${i}`)
            response = await request.post(endpoint, { data: requestBody });
            log.info(`Request is - \n${JSON.stringify(requestBody)} \n`);
            log.info(`Response is - \n${JSON.stringify(response)} \n`);
            let responseBody = JSON.parse(await response.text());
            log.info(`Response body is - \n ${JSON.stringify(responseBody)} \n`);

            if (response.status().toString().match(statusCode)) {
                return response;
            } else if (i == retryCount) {
                log.error(`${testConfig.maxRetryMessage} Response status is not as expected - ${testConfig.expectedMessage} ${statusCode}. ${testConfig.actualMessage} is ${response.status().toString()}`);
                return response;
            } else {
                log.info(`Response status is not as expected - ${statusCode}. Retrying to get call `);
            }
        }
    }

    async getValueForKeyFromJSONResponse(response: APIResponse, keyFromTest: string): Promise<string> {

        let responseBody = JSON.parse(await response.text());

        for (let key in responseBody) {
            if (key.match(keyFromTest)) {
                log.info(`Value for JSON Key - ${key} . In response body is - ${responseBody[keyFromTest]}`)
                return responseBody[keyFromTest];
            }
        }
        log.error(`No match for key. Returning null response for the key -> ${keyFromTest}`);
        return null;
    }
}
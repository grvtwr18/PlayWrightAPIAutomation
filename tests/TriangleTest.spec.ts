import { test, expect, APIResponse, APIRequestContext } from '@playwright/test';
import dataTriangle from '../datafiles/dataTriangleTest.json'
import { testConfig } from '../testConfig';
import { Logger } from "tslog";
import { APIUtils } from '../Utils/APIUtils';
const log: Logger = new Logger();
let response: APIResponse;
let successCode = '200';
let successStatusText = 'OK';
const apiActions = new APIUtils();
const testData = dataTriangle

test('Verify Get Endpoint to fetch Triangle API version', async ({ request }) => {

    response = await apiActions.get(request, `${testConfig.baseURI}/version`, successCode, testConfig.retry);

    await response.body().then(b => {
        let responseBody = b.toString().trim();
        log.info('Application Version is - ' + b.toString());

        expect.soft(`${response.status()} ${response.statusText()}`, `Status is not as expected'
        ${testConfig.actualMessage} ${response.statusText()}`).toBe(`${successCode} ${successStatusText}`);

        expect.soft(responseBody, `Application version in the response is not as expected'
                ${testConfig.actualMessage} ${b.toString()}`).toBe(testConfig.currentApplicatonVersion);

    });

});

testData.forEach(jsonData => {
    test(`Verify Post Endpoint response for ${jsonData.testKey}`, async ({ request }) => {

        let expStatusCode = jsonData.expStatusCode;
        let expStatusText = jsonData.expStatusText;
        let successMessage = jsonData.msgToValidate;

        response = await apiActions.post(request, `${testConfig.baseURI}`, jsonData.data, expStatusCode);

        let message = (await apiActions.getValueForKeyFromJSONResponse(response, jsonData.keyToGetFromResponse)).toString();

        expect.soft(`${response.status()} ${response.statusText()}`, "Response is not as expected ").toBe(`${expStatusCode} ${expStatusText}`);

        expect.soft(message, `The message in response is not as expected`).toBe(successMessage);

    });
});
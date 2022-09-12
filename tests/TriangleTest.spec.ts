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

//This test verifies Post and Get endpoint for Triangle API. There are around 13 different test scenarios being run from this test.
testData.forEach(jsonData => {
    test(`Verify ${jsonData.callFlag} endpoint response for ${jsonData.testKey}`, async ({ request }) => {

        let expStatusCode = jsonData.expStatusCode;
        let expStatusText = jsonData.expStatusText;
        let successMessage = jsonData.msgToValidate;
        let messageFromResponse: string;

        if (jsonData.callFlag.match("get")) {

            response = await apiActions.get(request, `${testConfig.baseURI}/version`, successCode, testConfig.retry);
            messageFromResponse = (await response.body()).toString()

        } else {

            response = await apiActions.post(request, `${testConfig.baseURI}/`, jsonData.data, expStatusCode);
            messageFromResponse = (await apiActions.getValueForKeyFromJSONResponse(response, jsonData.keyToGetFromResponse)).toString();
        }

        expect.soft(`${response.status()} ${response.statusText()}`, "Response is not as expected ").toBe(`${expStatusCode} ${expStatusText}`);

        expect.soft(messageFromResponse, `The message in response is not as expected`).toBe(successMessage);

    });
});
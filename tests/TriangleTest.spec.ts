import { test, expect, APIResponse, APIRequestContext } from '@playwright/test';
import dataTriangle from '../datafiles/dataTriangleTest.json'
import { testConfig } from '../testConfig';
import { APIUtils } from '../Utils/APIUtils';
let response: APIResponse;
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

            response = await apiActions.get(request, `${testConfig.baseURI}/version`, expStatusCode, testConfig.retry);
            messageFromResponse = (await response.body()).toString()

        } else {

            response = await apiActions.post(request, `${testConfig.baseURI}/`, jsonData.data, expStatusCode);
            messageFromResponse = (await apiActions.getValueForKeyFromJSONResponse(response, jsonData.keyToGetFromResponse)).toString();
        }

        expect.soft(`${response.status()} ${response.statusText()}`, "Verifying Response status is as expected ").toBe(`${expStatusCode} ${expStatusText}`);

        expect.soft(messageFromResponse, `Verifying Response body is as expected`,).toBe(successMessage);

    });
});
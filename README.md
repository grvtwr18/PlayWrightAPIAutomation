**Prerequisite** -
System should have the nodejs installed. If not then install it from below URL 

        https://nodejs.org/en/download/

**Installation** -

1. Clone the repo using below command

        git clone https://github.com/grvtwr18/WithSecureTriangleAPI.git

2. Navigate to folder **YourFolderLocationWhereYouHaveClonedTheProject\WithSecureTriangleAPI** and then install npm packages    dependency using command:

        npm install


**Run Tests** -
Tu run all tests at use below command in the command prompt launched in above Installation Step location. This will run around thirteen test for both the endpoints.

        npx playwright test

**Test Run Reports** -

1. Test run report is an HTML report and will open automatically in default browser. Make sure to close the reporting session    with 'CTRL+C' followed by Y in command prompt before rerunning the test. Otherwise if you dont close the current reporting thread, it will cause error as the address where the report is opened is already in use by the last report.

2. In case you want change the default behaviour of reporting, please got to playwright.config.ts file and go to param - reporter: [['html', { open: 'always' }]]. You can change the value of Open to -> 'never', 'on-failure'(this is default nature) 

3. To see the reports manually for the run you can navigate to folder **FolderLocation\WithSecureTriangleAPI\playwright-report** . Click on index.html file to open it with any browser. Or you can use below command to open the html report in the default system browser.

**Import in Visual Studio Code Editor** -

You can simply open the project if you have VS code Editor. 
    
        Clone the project as in first step
        Open the VS Code and go to File Option
        Go to open folder and choose the project cloned in you local. This will open your project in VS Code
        Go to View option in VS Code after importing the project and click on Terminal Option.
        Terminal will open in the project location. 
        You can run <npm install> to resolve dependencies.
        After this follow above step to run the the test from the terminal.
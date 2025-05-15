1. Preparation
    a. Install IntelliJ IDEA and Java 23
    b. Install npm
    c. Download android studio and create an android virtual device with android 15
2. Run the backend
    a. Open IntelliJ IDEA and import maven project using the pom.xml under server directory.
    b. Sync maven project and install any required dependencies.
    c. Edit running configurations and add the file server/able-nature-453223-m0-bf596414f9f7.json to environment variables
    d. Run the main method in server/src/main/java/com/example/server/ServerApplication.java
    e. The above mentioned json file is used as a key to access the google cloud sql server that we are using. However, you might still run into a connection error because your ip is not on the whitelist. Email us with your IP and we will help you to connect.
3. Run the frontend
    a. Launch the android virtual device until you see the android home screen
    b. Open a new terminal and cd to the client directory
    c. Run npm install
    d. Run npm start
    e. Press a on keyboard to launch the app on android virtual device 

# Maze_Game

What is the maze game:

The Maze Game is a two-player game that requires teamwork and coordination. Players are randomly assigned one of two roles:
* The Guide has a full view of the maze and will provide directions to the Navigator
* The Navigator is blind to the maze and moves using the "WASD" keys. They will have to follow the Guide's instructions. 

Your goal is to work together to navigate through the maze and reach the end before the timer runs out.

Please note:
* This game runs locally, so both players must be connected to the same Wi-Fi network
* This Game works best in Visual Studio Code(VSC) and requires Node.js to be installed.
 
How to run The Maze Game:
NOTE: Only one player needs to do steps 2-8. 

1. Connect to your Wi-Fi
    Ensure both player are on the same Wi-Fi network
2. Download the latest version of Node.js. 
3. Locate the Project Folder
    * Open the "Maze_Game_Final" folder.
    * Navigate to the "src" folder and open the "index.js" file.
4. Update the IPv4 Address in "index.js"
    * Find the section at the bottom of the "index.js" file marked with "x.x.x.x"
    * Replace "x.x.x.x" with your IPv4 Address
    
    To find your IPv4 address:
    * Open your computer Terminal and run ipconfig on windows, or ifconfig on MAC.
    * Look for "Wireless LAN adapter Wi-Fi:" This area will have your IPv4 Address.
5. Update the IPv4 Address in "guide.js"
    * Naviagte to the "public" folder within the "Maze_Game_Final" folder
    * open the "guide.js" file
    * Replace the x.x.x.x in the first line with your IPv4 address.
    (Do not change the port number, which should remain as 5000.)
6. Install required Dependecies
    * Right-click the "Maze_Game_Final" folder and open a terminal
    * Run the following commands to install the necessary packages:
        1. npm install express
        2. npm install socket.io
        3. npm init -y
7. Start the Game Server
    * In the same terminal run: npm run start
8. Access the Game in Your Browser
    * Both players should open a web browser and type the following URL into the address bar:
    http://your-IPv4-Address:5000
    * Replace the "your-IPv4-Address" with the address you found before
9. Both players will see the game menu. Click "start game", to begin. (both players need to click it for it to work)

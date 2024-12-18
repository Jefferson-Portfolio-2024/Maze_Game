# Maze_Game

What is the maze game:

The maze game is a 2 player game that requires teamwork and coordination. Players will randomally be assigned a role of navigator or guide. The guide will have the full view of the maze, while the navigator is completely blinded. The guide will give the navigator direction on how to step through the maze. The navigator will use the "WASD" keys to move around the maze. Your goal is to get to the end of the maze before time runs out. NOTE: This game is ran locally, therefore both players need to be connected to the same WIFI connection. This game runs best on Visual Studio Code(VSC). This game will also require you to download the Node.js package. 

How to run The Maze Game:
NOTE: Only one player needs to do steps 2-8. 

1. Connect to your WIFI
2. Download the latest version of node.js online. Simply search for node.js and download it. 
3. Once you have downloaded Node.js, open the "Maze_Game_Final" and open the "index.js" file located in the "src" file. 
4. At the Bottom of the "index.js" file there will be a spot to enter in your IPv4 address. Replace the x.x.x.x with your IPv4 address.
    To find your IPv4 address:
    1. Open your computer Terminal and run ipconfig on windows, or ifconfig on MAC.
    2. Look for "Wireless LAN adapter Wi-Fi:" This area will have your IPv4 Address.
5. Find the file "guide.js" located in the "public" folder within the "Maze_Game_final" folder.
6. repeat step 4, but you will change the very first line. (it is marked with x.x.x.x) (DONT change the port number(5000))
7. Now Right-click on the "Maze_Game_Final" folder and open a terminal, then Run the following commands: npm install express, npm install socket.io, and npm init -y.
8. On the same terminal run: npm run start
9. Both Players, On your browsers type http://your-IPv4-Address:5000 into the URL. This should give you a menu to the Maze Game (player two should be the same address, as player 1)
10. both players need to click "start game", for the game to start.

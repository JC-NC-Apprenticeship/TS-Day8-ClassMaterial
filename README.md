# Mitch's Treasure Palace

## Typescript extended learning session 7

## Intro

Who is Mitch? why does Mitch have a treasure palace? what is this?
Mitch owns an emporium soley for the purpose of buying and selling antiques, the global pandemic has meant Mitch has had to branch out into the world wide web.

In the rush to get everything up and running Mitch has written some code that now Mitch isn't too sure about, your tasks will be to make some changes to the code to clear up the application.

## Tasks

### 1.

In the first iteration Mitch decided to use a treasureId as a unique key, however Mitch wants to make this into a string to keep his options open if the treasure palace takes off.

Change the data in the json docs to have the treasure_id be a string.
** dont forget to run generate-types **

### 2.

Mitch has decided (unusually) that subscribed_to_newsletter is too long a column name and wants to store it as isSubscribed, change the data in the json files and make the changes through the application.

### 3.

In Mitch's haste to get up and running he decided to not differentiate between customers and shop owners, add a type property to each of the users to show they are either a "owner" or a "customer"

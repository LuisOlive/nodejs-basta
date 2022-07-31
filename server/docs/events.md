# Events guide

## events conventions

- event names in single present
- all in lowercase
- emisor + ":" + action naming

## Expected cronology

an user enters to the site interface.

- it ain't logged, so it's a guest

```
guest -> guest:enter
```

guest puts it name and favorite color at form, it's logged now

```
guest -> player:enter
```

if user is the first player at room, its the admin

```
player <- player:becomeadmin
```

it gets registered at room list, we got to warn all players.

```
all players <- room:update
```

if they're enough players

## Game

the game is the global object that saves all rooms.

**`game:start`** indicates the room id is already created

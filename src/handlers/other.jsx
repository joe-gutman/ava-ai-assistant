var commands = {
  "list": {
    "commands": ["create", "delete", "add item", "delete item", "mark complete", "mark incomplete", "show", "show all", "hide"],
    "response": "{ 'command': command, 'list': listName, 'item': itemName, 'completed': completed, 'reply': reply }",
  "conversation": {
    "response": "{ 'reply': reply }"
  },
  "other": {
    "response": "{ 'reply': 'I don't know how to do that yet.'}"
  },
  "none": {
    "response": "{ 'reply': 'I'm sorry, I didn't understand that.'}"
  }
}
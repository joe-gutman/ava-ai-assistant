const listHandler = (command, args) => {
  const commands = {
    "create": () => {},
    "delete": () => {},
    "add item": () => {},
    "delete item": () => {},
    "mark complete": () => {},
    "mark incomplete": () => {},
    "show": () => {},
    "show all": () => {},
    "hide": () => {},
  };

  const handler = commands[command](args);

  if (!handler) {
    console.error(`No handler for command: ${command}`);
    return;
  }
}

export default listHandler;
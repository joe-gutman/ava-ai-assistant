import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import CSS from './lists.css';
import api from '../../utils/list-utils.jsx';

const Lists = ({ user, command, universalShowHide}) => {
  const [currentList, setCurrentList] = useState({});
  const [showAllLists, setShowAllLists] = useState(false);
  const [showLists, setShowLists] = useState(false);
  const initialRender = useRef(true);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    console.log('current list updated:', currentList);
  }, [currentList]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (command.category === 'handlelists') {
/* ------------------------------- create list ------------------------------ */
        if (command.action === 'create') {
          api.createList(user, command.list)
            .then((newList) => {
              console.log('new list:', newList)
              if (showAllLists) {
                console.log('getting lists')
                return api.getList(user)
                  .then((lists) => {
                    setCurrentList(lists);
                    return lists;
                  });
              } else {
                setCurrentList(newList);
              }
            })
            .catch((error) => {
              console.error('Error creating list:', error);
            });
/* ------------------------------- delete list ------------------------------ */
        } else if (command.action === 'delete') {
          if (currentList.list_name === command.list) {
            setCurrentList({});
          }
          api.deleteList(user, command.list)
            .then((updatedList) => {
              if (showAllLists) {
                  console.log('getting lists')
                  return api.getList(user)
                    .then((lists) => {
                      setCurrentList(lists);
                      return lists;
                    });
                }
            })
            .catch((error) => {
              console.error('Error deleting list:', error);
            });
/* ------------------------------- add item ------------------------------ */
        } else if (command.action === 'add item') {
          console.log('adding item:', command.item)
          api.addListItem( user, command.list, command.item )
            .then((updatedList) => {
              console.log('updated list:', updatedList)
              setCurrentList(updatedList);
            })
            .catch((error) => {
              console.error('Error updating list:', error);
            });
/* ------------------------------- delete item ------------------------------ */
        } else if (command.action === 'delete item') {
          api.deleteListItem(user, command.list, command.item)
            .then((updatedList) => {
              setCurrentList(updatedList);
            })
            .catch((error) => {
              console.error('Error updating list:', error);
            });
/* ------------------------------- mark complete ------------------------------ */
        }  else if (command.action === 'mark complete') {
          api.updateListItem( user, command.list, command.item, true)
            .then((updatedList) => {
              setCurrentList(updatedList);
            })
            .catch((error) => {
              console.error('Error updating list:', error);
            });
/* ------------------------------- mark incomplete ------------------------------ */
        } else if (command.action === 'mark incomplete') {
          api.updateListItem( user, command.list, command.item, false)
            .then((updatedList) => {
              setCurrentList(updatedList);
            })
            .catch((error) => {
              console.error('Error updating list:', error);
            });
/* ------------------------------- show list ------------------------------ */
        } else if (command.action === 'show') {
          console.log('getting list:', user, command.list)
          api.getList(user, command.list)
            .then((list) => {
              setShowAllLists(false);
              setCurrentList(list);
            })
            .catch((error) => {
              console.error('Error getting list:', error);
            });
/* ------------------------------- show all lists ------------------------------ */
        } else if (command.action === 'show all') {
          api.getList(user)
            .then((allLists) => {
              console.log('all lists:', allLists);
              setShowAllLists(true);
              setCurrentList(allLists);
            })
            .catch((error) => {
              console.error('Error getting all lists:', error);
            });
/* ------------------------------- hide list ------------------------------ */
        } else if (command.action === 'hide' || command.action === 'close' || command.action === 'hide all') {
          setCurrentList({});
          setShowAllLists(false);
        }
      }
    }
  }, [command]);

  return createPortal(
    showAllLists ? (
      <div className="mdl-background">
        <div className="mdl-list">
          <h2 className="mdl-list-title">Lists</h2>
          <ul>
            {Object.keys(currentList).map((key) => (
              <li key={key}>{currentList[key].list_name}</li>
            ))}
          </ul>
        </div>
      </div>
    ) : Object.keys(currentList).length > 0 ? (
      <div className="mdl-background">
        <div className="mdl-list">
          <h2 className="mdl-list-title">{currentList.list_name}</h2>
          <ul>
            {currentList.list_items.map((item) => (
              <li key={item.item}>
                <label className="mdl-checkbox mdl-js-checkbox" htmlFor={item.item}>
                  <input
                    type="checkbox"
                    id={item.item}
                    className="mdl-checkbox-input"
                    checked={item.complete}
                  />
                  <span className="mdl-checkbox-label">{item.list_item}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ) : null,
    document.body
  );
};

export default Lists;
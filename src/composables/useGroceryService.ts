export default function useGroceryService() {

  function getListsFromLocalStorage () {
    const lists = localStorage.getItem('groceryLists');
    return lists ? JSON.parse(lists) : [];
  }

  function saveListToLocalStorage (list: any) {
    const lists = getListsFromLocalStorage();
    lists.push(list);
    localStorage.setItem('groceryLists', JSON.stringify(lists));
  }

  function createList(newListTitle: string) {
    if (newListTitle.trim() === '') {
      alert('Le titre de la liste ne peut pas être vide.');
      return;
    }
    
    const newList = {
      id: Date.now(),
      title: newListTitle,
      items: [],
    };
    
    saveListToLocalStorage(newList);
  }

  function getListById(id: number) {
    const lists = getListsFromLocalStorage(); 
    return lists.find((list: any) => list.id === id);
  }

  function addItemToList(listId: number, item: Object) {
    const lists = getListsFromLocalStorage();
    const list = lists.find((list: any) => list.id === listId);
    
    if (list) {
      list.items.push(item);
      localStorage.setItem('groceryLists', JSON.stringify(lists));
    }
  }

  function deleteOneItemFromList(listId: number, itemId: number) {
    const lists = getListsFromLocalStorage();
    const list = lists.find((list: any) => list.id === listId);
    
    if (list) {
      list.items = list.items.filter((item: any) => item.id !== itemId);
      localStorage.setItem('groceryLists', JSON.stringify(lists));
    }
  }

  function toggleItemDone(listId: number, itemId: number) {
    const lists = getListsFromLocalStorage();
    const list = lists.find((list: any) => list.id === listId);
    
    if (list) {
      const item = list.items.find((item: any) => item.id === itemId);
      if (item) {
        item.done = !item.done;
        localStorage.setItem('groceryLists', JSON.stringify(lists));
      }
    }
  }

  function deleteAllDoneItemsInList (listId: number) {
    const lists = getListsFromLocalStorage();
    const list = lists.find((list: any) => list.id === listId);
    if (list) {
      list.items = list.items.filter((item: any) => !item.done);
      localStorage.setItem('groceryLists', JSON.stringify(lists));
    } else {
      console.error(`List with id ${listId} not found.`);
    }
  }

  return {
    getListsFromLocalStorage,
    getListById,
    createList,
    addItemToList,
    deleteOneItemFromList,
    toggleItemDone,
    deleteAllDoneItemsInList,
  }
}
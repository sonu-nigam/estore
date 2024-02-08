export const reducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.value];
    case 'REMOVE_FROM_CART':
      return [...state, action.value];
    default: 
      return state;
  }
}


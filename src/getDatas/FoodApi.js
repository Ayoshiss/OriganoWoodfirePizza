import firestore from '@react-native-firebase/firestore';

export async function getPizzaData(pizzaRetrieved) {
  let pizzaList = [];
  let snapshot = await firestore().collection('Pizza').get();

  snapshot.forEach((doc) => {
    const pizzaItem = doc.data();
    pizzaList = [...pizzaList, pizzaItem];
  });

  pizzaRetrieved(pizzaList);
}

export async function getSpecialData(specialRetrieved) {
  let specialList = [];
  let snapshot = await firestore().collection("Today's Special").get();

  snapshot.forEach((doc) => {
    const specialItem = doc.data();
    specialList = [...specialList, specialItem];
  });
  specialRetrieved(specialList);
}

export async function getToppingsData(toppingsRetrieved) {
  let toppingsList = [];
  let snapshot = await firestore().collection('Toppings').get();

  snapshot.forEach((doc) => {
    const toppingItem = doc.data();
    toppingsList = [...toppingsList, toppingItem];
  });
  toppingsRetrieved(toppingsList);
}

export async function getBurgerData(burgerRetrieved) {
  let burgerList = [];
  let snapshot = await firestore().collection('Burgers').get();

  snapshot.forEach((doc) => {
    const burgerItem = doc.data();
    burgerList = [...burgerList, burgerItem];
  });
  burgerRetrieved(burgerList);
}

export async function getPastaData(pastaRetrieved) {
  let pastaList = [];
  let snapshot = await firestore().collection('Pasta').get();

  snapshot.forEach((doc) => {
    const pastaItem = doc.data();
    pastaList = [...pastaList, pastaItem];
  });
  pastaRetrieved(pastaList);
}

export async function getSaladData(saladRetrieved) {
  let saladList = [];
  let snapshot = await firestore().collection('Salad').get();

  snapshot.forEach((doc) => {
    const saladItem = doc.data();
    saladList = [...saladList, saladItem];
  });
  saladRetrieved(saladList);
}

export async function getEntreeData(entreeRetrieved) {
  let entreeList = [];
  let snapshot = await firestore().collection('Entree and Sides').get();

  snapshot.forEach((doc) => {
    const entreeItem = doc.data();
    entreeList = [...entreeList, entreeItem];
  });
  entreeRetrieved(entreeList);
}

export async function getDessertData(desertRetrieved) {
  let dessertList = [];
  let snapshot = await firestore().collection('Dessert').get();

  snapshot.forEach((doc) => {
    const dessertItem = doc.data();
    dessertList = [...dessertList, dessertItem];
  });
  desertRetrieved(dessertList);
}

export async function getBeverageData(beverageRetrieved) {
  let beverageList = [];
  let snapshot = await firestore().collection('Beverages').get();

  snapshot.forEach((doc) => {
    const beverageItem = doc.data();
    beverageList = [...beverageList, beverageItem];
  });
  beverageRetrieved(beverageList);
}

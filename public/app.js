// here we call firebase

const auth = firebase.auth();

// get elements by id  sections

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

// get butttons by id signin and signout

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

// get the Id from the div userdetails

const userDetails = document.getElementById ('userDetails');

// calling papa google

const provider = new firebase.auth.GoogleAuthProvider();

// set the popup window on the button aka login with google

signInBtn.onclick = () => auth.signInWithPopup(provider);

//allow the user to sign out

signOutBtn.onclick = () => auth.signOut();

// firebase auth managing whether user is logged in or not

auth.onAuthStateChanged(user => {
    
    if(user) {
        // user is signed
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hey there ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`; 

    } else {
        // user is not 
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';

    }
});

// reference to the firestore SDK as the variable db

const db = firebase.firestore();

// set variables to create random stuff and the list

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

// reference to database location

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if(user) {

        thingsRef = db.collection('things')

        createThing.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
          }

        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                
                // Map results to an array of li elements

            const items = querySnapshot.docs.map(doc => {

                return `<li>${ doc.data().name }</li>`

            });

            thingsList.innerHTML = items.join('');

            });

    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }

});
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseConfig } from '../../secrets';
import getTheClassics from '../../yelp/getTheClassics';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  getCurrentUser = () => this.auth.currentUser;

  getUserFromDb = async uid => {
    const doc = await this.db.collection('users').doc(uid).get();
    return doc.data();
  }

  getAuthStateChanged = cb =>
    this.auth.onAuthStateChanged(cb);

  doSignUp = async (email, password, username) => {
    try {
      const { user } = await this.auth.createUserWithEmailAndPassword(email, password);
      await user.updateProfile({ displayName: username });
      this.db.collection('users').doc(user.uid).set({
        displayName: user.displayName,
        email: user.email,
        pizzeriasVisited: [],
        pizzeriasToVisit: []
      })
    } catch (err) {
      console.log(err);
    }
  }

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  seedClassics = async () => {
    await getTheClassics(this.db);
  }
}

export default Firebase;
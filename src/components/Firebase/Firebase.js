import app from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from '../../secrets';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
  }

  getCurrentUser = () => this.auth.currentUser;

  getAuthStateChanged = cb =>
    this.auth.onAuthStateChanged(cb);

  doSignUp = async (email, password, username) => {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
      this.getAuthStateChanged(user => user.updateProfile({ displayName: username }));
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
}

export default Firebase;
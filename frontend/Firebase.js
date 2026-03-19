import{initializeApp} from "Firebase/app";
import{getAuth} from "Firebase/auth";
import {gerFirestore} from "firebase/firestore";

const firebaseConfig={
    apikey: "Your_key",
    authDomain: "Your_domain",
    projectId: "Your_Project_ID",
};
const app=initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
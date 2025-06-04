import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export class FirebaseAuthService {
  static async signInAndGetToken(
    email: string,
    password: string
  ): Promise<string> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (!user) throw new Error("ユーザー情報が取得できませんでした");
    return user.getIdToken();
  }
}

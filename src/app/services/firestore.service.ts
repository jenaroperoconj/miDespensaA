import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async addProduct(product: any, capturedImage: string | null): Promise<any> {
    const user = await this.auth.currentUser;

    if (!user) {
      return Promise.reject('Usuario no autenticado');
    }

    const userId = user.uid;

    let imageUrl = '';
    if (capturedImage) {
      const storage = getStorage();
      const imageRef = ref(storage, `productos/${product.nombre}-${Date.now()}.jpg`);
      await uploadString(imageRef, capturedImage, 'data_url');
      imageUrl = await getDownloadURL(imageRef);
    }

    product.imagen = imageUrl;


    return this.firestore
      .collection('usuarios')
      .doc(userId)
      .collection('productos')
      .add(product);
  }

  deleteProduct(productId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.currentUser.then(user => {
        if (!user) {
          reject('Usuario no autenticado');
          return;
        }
  
        this.firestore
          .collection('usuarios')
          .doc(user.uid)
          .collection('productos')
          .doc(productId)
          .delete()
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }).catch(error => {
        reject(error);
      });
    });
  }

  getProducts(): Observable<any[]> {
    return new Observable(observer => {
      this.auth.currentUser.then(user => {
        if (!user) {
          observer.error('Usuario no autenticado');
          return;
        }
  
        this.firestore
          .collection('usuarios')
          .doc(user.uid)
          .collection('productos')
          .valueChanges({ idField: 'id' })
          .subscribe(
            (productos) => observer.next(productos), 
            (error) => observer.error(error)
          );
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getProductById(id: string): Observable<any> {
    return new Observable(observer => {
      this.auth.currentUser.then(user => {
        if (!user) {
          observer.error('Usuario no autenticado');
          return;
        }
  
        const userId = user.uid;
  
        this.firestore
          .collection('usuarios')
          .doc(userId)
          .collection('productos')
          .doc(id)
          .valueChanges()
          .subscribe(
            (product) => observer.next(product),
            (error) => observer.error(error)
          );
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  updateProduct(id: string, productData: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.auth.currentUser;
        if (!user) {
          return reject('Usuario no autenticado');
        }
  
        const userId = user.uid;
  
        this.firestore
          .collection('usuarios')
          .doc(userId)
          .collection('productos')
          .doc(id)
          .update(productData)
          .then(() => resolve())
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }
}

import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg,
  IonLoading,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import {book, build, colorFill, grid, camera} from 'ionicons/icons';
import React, {Component} from 'react';
import {Plugins, CameraResultType} from '@capacitor/core';
import {createWorker} from 'tesseract.js';

import './Home.css';
import {doOCR} from '../services/ocr';

const {Camera} = Plugins;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'https://www.parabaas.com/GRISHMO2/LEKHAGIF12/bPather12_p3.gif',
      showLoading: false,
      showModal: false,
      result: {},
    };
  }

  //const worker = createWorker({
  //  logger: m => console.log(m),
  //});

  /*  doOCR = async (img) => {
      const worker = createWorker({
        logger: m => console.log(m),
      });
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(img);
      console.log(text);
    };*/

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // var imageUrl = image.webPath;
    const imageBase64 = image.base64String;
//    console.log(imageBase64);
    this.setState({
      image: `data:image/png;base64,${imageBase64}`,
    });
    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  };

  render() {
    const {result} = this.state;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton/>
            </IonButtons>
            <IonTitle>IMAGE TO TEXT</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {
            result && result.text && (
              <IonCard>
                <IonCardSubtitle>
                  <IonButton
                    color="danger"
                    onClick={() => {
                      this.setState({
                        result: {},
                      });
                    }}
                  >
                    CLOSE
                  </IonButton>
                </IonCardSubtitle>
                {/*<IonCardTitle>*/}
                {/*  Accuracy: {result.details.confidence}*/}
                {/*</IonCardTitle>*/}
                <IonCardContent>
                  {result.text}
                </IonCardContent>
              </IonCard>
            )
          }
          <IonCard className="welcome-card">
            <IonCardSubtitle>
              <IonButton
                type="primary"
                onClick={async () => {
                  try {
                    await this.takePicture();
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <IonIcon slot="start" icon={camera}/>
                TAKE PHOTO
              </IonButton>
            </IonCardSubtitle>
          </IonCard>
          {
            this.state.image && (
              <IonCard>
                <IonCardSubtitle>
                  <IonButton
                    type="primary"
                    onClick={async () => {
                      await this.setState({
                        showLoading: true,
                      });
                      const res = await doOCR(this.state.image);
                      console.log(res);
                      if (res && res.data) {
                        await this.setState({
                          result: res.data,
                          showModal: true,
                          showLoading: false,
                        });
                      } else {
                        this.setState({
                          showLoading: false,
                        });
                      }
                    }}
                  >
                    <IonIcon slot="start" icon={grid}/>
                    CONVERT
                  </IonButton>
                </IonCardSubtitle>
                <IonCardContent>
                  <IonImg src={this.state.image} alt="N/A"/>
                </IonCardContent>
              </IonCard>
            )
          }
          <IonLoading
            duration={0}
            isOpen={this.state.showLoading}
            onDidDismiss={() => {
              this.setState({
                showLoading: false,
              });
            }}
            message={'Loading...'}
            translucent
            backdropDismiss={false}
          />
        </IonContent>
      </IonPage>
    );
  }
}

export default HomePage;

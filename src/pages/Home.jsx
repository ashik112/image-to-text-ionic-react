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
      image: 'data:image/png;base64,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',
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
              <>
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
                    <span style={{whiteSpace: "pre-line"}}>{result.text}</span>
                  </IonCardContent>
                </IonCard>
                <IonCard>
                  <IonCardSubtitle>
                    PRE-PROCESSED IMAGE
                  </IonCardSubtitle>
                  {/*<IonCardTitle>*/}
                  {/*  Accuracy: {result.details.confidence}*/}
                  {/*</IonCardTitle>*/}
                  <IonCardContent>
                    <IonImg src={result.image} alt="N/A"/>
                  </IonCardContent>
                </IonCard>
              </>
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

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
import { book, build, colorFill, grid, camera } from 'ionicons/icons';
import React, {Component} from 'react';
import { Plugins, CameraResultType } from '@capacitor/core'
import { createWorker } from 'tesseract.js';

import './Home.css';
import { doOCR } from '../services/ocr';

const { Camera } = Plugins;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'https://www.parabaas.com/GRISHMO2/LEKHAGIF12/bPather12_p3.gif',
      showLoading: false,
      showModal: false,
      result: {},
    }
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
    const { showModal, result } = this.state;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard className="welcome-card">
            {/*<img src="/assets/shapes.svg" alt=""/>*/}
            <IonCardHeader>
              <IonCardSubtitle>OCR TEST!</IonCardSubtitle>
              <IonCardTitle>DEMO</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton
                type="primary"
                onClick={async () =>{
                  try {
                    await this.takePicture();
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <IonIcon slot="start" color="medium" icon={camera}/>
                TAKE PHOTO
              </IonButton>
            </IonCardContent>
          </IonCard>
          {
            this.state.image && (
              <IonCard>
                <IonCardContent>
                  <IonImg src={this.state.image} alt="N/A" />
                  <IonButton
                    type="primary"
                    onClick={async () =>{
                      await this.setState({
                        showLoading: true,
                      });
                      const res = await doOCR(this.state.image);
                      console.log(res);
                      if(res && res.data) {
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
                    <IonIcon slot="start" color="medium" icon={camera}/>
                    DO OCR
                  </IonButton>
                </IonCardContent>
              </IonCard>
            )
          }

          {/*<IonList lines="none">*/}
          {/*  <IonListHeader>*/}
          {/*    <IonLabel>Resources</IonLabel>*/}
          {/*  </IonListHeader>*/}
          {/*  <IonItem href="https://ionicframework.com/docs/" target="_blank">*/}
          {/*    <IonIcon slot="start" color="medium" icon={book} />*/}
          {/*    <IonLabel>Ionic Documentation</IonLabel>*/}
          {/*  </IonItem>*/}
          {/*  <IonItem href="https://ionicframework.com/docs/building/scaffolding" target="_blank">*/}
          {/*    <IonIcon slot="start" color="medium" icon={build} />*/}
          {/*    <IonLabel>Scaffold Out Your App</IonLabel>*/}
          {/*  </IonItem>*/}
          {/*  <IonItem href="https://ionicframework.com/docs/layout/structure" target="_blank">*/}
          {/*    <IonIcon slot="start" color="medium" icon={grid} />*/}
          {/*    <IonLabel>Change Your App Layout</IonLabel>*/}
          {/*  </IonItem>*/}
          {/*  <IonItem href="https://ionicframework.com/docs/theming/basics" target="_blank">*/}
          {/*    <IonIcon slot="start" color="medium" icon={colorFill} />*/}
          {/*    <IonLabel>Theme Your App</IonLabel>*/}
          {/*  </IonItem>*/}
          {/*</IonList>*/}
          <IonLoading
            isOpen={this.state.showLoading}
            onDidDismiss={() => {
              this.setState({
                showLoading: false,
              });
            }}
            message={'Loading...'}
            duration={5000}
            translucent
            backdropDismiss={false}
          />
          {
            result && result.text && (
              <IonModal
                isOpen={showModal}
              >
                <IonGrid>
                  {/*<IonRow>*/}
                  {/*  <IonCol>*/}
                  {/*    <p>Converted Image</p><br/>*/}
                  {/*    <IonImg src={result.image} alt="N/A"/>*/}
                  {/*  </IonCol>*/}
                  {/*</IonRow>*/}
                  <IonRow>
                    <IonCol>
                        <p>
                          Result <br/>
                          Confidence: {result.details.confidence} <br/>
                          {result.text}
                        </p>
                    </IonCol>
                  </IonRow>
                </IonGrid>
                {/*<IonCard style={{height: '100%'}}>*/}
                {/*  <IonCardHeader>*/}
                {/*    <IonCardTitle>Converted Image</IonCardTitle>*/}
                {/*  </IonCardHeader>*/}
                {/*  <IonCardContent>*/}
                {/*    <IonImg src={result.image} alt="N/A"/>*/}
                {/*  </IonCardContent>*/}
                {/*</IonCard>*/}
                {/*<IonCard style={{height: '100%'}}>*/}
                {/*  <IonCardHeader>*/}
                {/*    <IonCardSubtitle>OCR RESULT</IonCardSubtitle>*/}
                {/*    <IonCardTitle>Confidence: {result.details.confidence}</IonCardTitle>*/}
                {/*  </IonCardHeader>*/}
                {/*  <IonCardContent>*/}
                {/*    <pre>*/}
                {/*      {result.text}*/}
                {/*    </pre>*/}
                {/*  </IonCardContent>*/}
                {/*</IonCard>*/}
                <IonButton onClick={() => this.setState({ showModal: false })}>Close Modal</IonButton>
              </IonModal>
            )
          }
        </IonContent>
      </IonPage>
    );
  }
}

export default HomePage;
